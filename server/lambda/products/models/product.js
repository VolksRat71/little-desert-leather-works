/**
 * Product Model
 * Handles all database operations related to products
 */
class ProductModel {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  /**
   * Find all products with pagination
   * @param {number} limit - Number of products to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of product objects
   */
  async findAll(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, description, price, category, image_url, stock_quantity, created_at, updated_at
      FROM products
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error in ProductModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Find products by category
   * @param {string} category - Product category
   * @param {number} limit - Number of products to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of product objects
   */
  async findByCategory(category, limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, description, price, category, image_url, stock_quantity, created_at, updated_at
      FROM products
      WHERE category = ?
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [category, limit, offset]);
      return rows;
    } catch (error) {
      console.error(`Error in ProductModel.findByCategory for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Find a product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} - Product object or null if not found
   */
  async findById(id) {
    const query = `
      SELECT id, name, description, price, category, image_url, stock_quantity, created_at, updated_at
      FROM products
      WHERE id = ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error in ProductModel.findById for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data object
   * @returns {Promise<Object>} - Created product object
   */
  async create(productData) {
    const query = `
      INSERT INTO products (name, description, price, category, image_url, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await this.pool.execute(query, [
        productData.name,
        productData.description,
        productData.price,
        productData.category,
        productData.imageUrl || null,
        productData.stockQuantity || 0
      ]);

      // Return the created product
      return {
        id: result.insertId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image_url: productData.imageUrl || null,
        stock_quantity: productData.stockQuantity || 0,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error in ProductModel.create:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} productData - Product data to update
   * @returns {Promise<Object>} - Updated product object
   */
  async update(id, productData) {
    // Build the SET part of the query dynamically based on provided fields
    const setFields = [];
    const values = [];

    if (productData.name) {
      setFields.push('name = ?');
      values.push(productData.name);
    }

    if (productData.description) {
      setFields.push('description = ?');
      values.push(productData.description);
    }

    if (productData.price !== undefined) {
      setFields.push('price = ?');
      values.push(productData.price);
    }

    if (productData.category) {
      setFields.push('category = ?');
      values.push(productData.category);
    }

    if (productData.imageUrl !== undefined) {
      setFields.push('image_url = ?');
      values.push(productData.imageUrl);
    }

    if (productData.stockQuantity !== undefined) {
      setFields.push('stock_quantity = ?');
      values.push(productData.stockQuantity);
    }

    setFields.push('updated_at = NOW()');

    // If no fields to update, return the product as is
    if (setFields.length === 1) {
      return this.findById(id);
    }

    // Add the ID to the values array
    values.push(id);

    const query = `
      UPDATE products
      SET ${setFields.join(', ')}
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, values);

      // Return the updated product
      return this.findById(id);
    } catch (error) {
      console.error(`Error in ProductModel.update for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} - True if deleted, false otherwise
   */
  async delete(id) {
    const query = `
      DELETE FROM products
      WHERE id = ?
    `;

    try {
      const [result] = await this.pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in ProductModel.delete for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search products by name or description
   * @param {string} searchTerm - Term to search for
   * @param {number} limit - Number of products to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of product objects
   */
  async search(searchTerm, limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, description, price, category, image_url, stock_quantity, created_at, updated_at
      FROM products
      WHERE name LIKE ? OR description LIKE ?
      LIMIT ? OFFSET ?
    `;

    const searchPattern = `%${searchTerm}%`;

    try {
      const [rows] = await this.pool.execute(query, [searchPattern, searchPattern, limit, offset]);
      return rows;
    } catch (error) {
      console.error(`Error in ProductModel.search for term ${searchTerm}:`, error);
      throw error;
    }
  }
}

module.exports = ProductModel;
