import express from 'express';
import { prisma } from '../index';
import { z } from 'zod';

const router = express.Router();

// Schema validation for product creation/update
const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  price: z.number().positive({ message: "Price must be positive" }),
  imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
  stock: z.number().int().nonnegative().optional()
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const validationResult = productSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.format()
      });
    }

    const productData = validationResult.data;
    const newProduct = await prisma.product.create({
      data: productData
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = productSchema.partial().safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.format()
      });
    }

    const productData = validationResult.data;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
