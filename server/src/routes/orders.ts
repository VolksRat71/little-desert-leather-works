import express from 'express';
import { prisma } from '../index';
import { z } from 'zod';

const router = express.Router();

// Schema validation for order item
const orderItemSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID" }),
  quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }),
  price: z.number().positive({ message: "Price must be positive" })
});

// Schema validation for order creation
const orderCreateSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID" }),
  items: z.array(orderItemSchema).min(1, { message: "Order must have at least one item" }),
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional()
});

// Schema validation for order update
const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
}).partial();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const validationResult = orderCreateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.format()
      });
    }

    const orderData = validationResult.data;

    // Calculate total
    const total = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order in a transaction to ensure data consistency
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
          status: orderData.status || 'PENDING',
          total,
          items: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true,
          user: true
        }
      });

      // Update product stock
      for (const item of orderData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = orderUpdateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.format()
      });
    }

    const orderData = validationResult.data;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: orderData,
      include: {
        items: true
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete in a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // First delete order items
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });

      // Then delete the order
      await tx.order.delete({
        where: { id }
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
