/**
 * Order Model
 * Handles all database operations related to orders
 */
class OrderModel {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  /**
   * Find all orders with pagination (admin endpoint)
   * @param {number} limit - Number of orders to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of order objects
   */
  async findAll(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.billing_address,
             o.created_at, o.updated_at, o.cancelled_at, o.cancellation_reason,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', oi.product_name
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [limit, offset]);

      // Parse the items JSON string for each order
      return rows.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }));
    } catch (error) {
      console.error('Error in OrderModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Find orders for a specific user
   * @param {number} userId - User ID
   * @param {number} limit - Number of orders to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of order objects
   */
  async findByUserId(userId, limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.billing_address,
             o.created_at, o.updated_at, o.cancelled_at, o.cancellation_reason,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', oi.product_name
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [userId, limit, offset]);

      // Parse the items JSON string for each order
      return rows.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }));
    } catch (error) {
      console.error(`Error in OrderModel.findByUserId for userId ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Find a specific order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>} - Order object or null if not found
   */
  async findById(orderId) {
    const query = `
      SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.billing_address,
             o.created_at, o.updated_at, o.cancelled_at, o.cancellation_reason,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', oi.product_name
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `;

    try {
      const [rows] = await this.pool.execute(query, [orderId]);

      if (!rows.length) {
        return null;
      }

      // Parse the items JSON string
      return {
        ...rows[0],
        items: JSON.parse(rows[0].items)
      };
    } catch (error) {
      console.error(`Error in OrderModel.findById for orderId ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new order
   * @param {Object} orderData - Order data object
   * @returns {Promise<Object>} - Created order object
   */
  async create(orderData) {
    // Start a transaction
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert the order
      const orderQuery = `
        INSERT INTO orders (user_id, total_amount, status, shipping_address, billing_address)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [orderResult] = await connection.execute(orderQuery, [
        orderData.userId,
        orderData.totalAmount,
        orderData.status || 'pending',
        JSON.stringify(orderData.shippingAddress),
        JSON.stringify(orderData.billingAddress || orderData.shippingAddress)
      ]);

      const orderId = orderResult.insertId;

      // Insert the order items
      const itemsQuery = `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `;

      for (const item of orderData.items) {
        await connection.execute(itemsQuery, [
          orderId,
          item.productId,
          item.productName,
          item.quantity,
          item.price
        ]);
      }

      // Commit the transaction
      await connection.commit();

      // Return the created order
      return this.findById(orderId);
    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback();
      console.error('Error in OrderModel.create:', error);
      throw error;
    } finally {
      // Release the connection
      connection.release();
    }
  }

  /**
   * Update an order's status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Updated order object
   */
  async updateStatus(orderId, status) {
    const query = `
      UPDATE orders
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, [status, orderId]);

      // Return the updated order
      return this.findById(orderId);
    } catch (error) {
      console.error(`Error in OrderModel.updateStatus for orderId ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} - Updated order object
   */
  async cancelOrder(orderId, reason) {
    const query = `
      UPDATE orders
      SET status = 'cancelled', cancelled_at = NOW(), cancellation_reason = ?, updated_at = NOW()
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, [reason, orderId]);

      // Return the updated order
      return this.findById(orderId);
    } catch (error) {
      console.error(`Error in OrderModel.cancelOrder for orderId ${orderId}:`, error);
      throw error;
    }
  }
}

module.exports = OrderModel;
