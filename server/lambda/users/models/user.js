/**
 * User Model
 * Handles all database operations related to users
 */
class UserModel {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  /**
   * Find all users with pagination
   * @param {number} limit - Number of users to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of user objects
   */
  async findAll(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, username, email, first_name, last_name, role, created_at, updated_at
      FROM users
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error in UserModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findById(id) {
    const query = `
      SELECT id, username, email, first_name, last_name, role, created_at, updated_at
      FROM users
      WHERE id = ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error in UserModel.findById for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findByEmail(email) {
    const query = `
      SELECT id, username, email, first_name, last_name, role, created_at, updated_at
      FROM users
      WHERE email = ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error in UserModel.findByEmail for email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @returns {Promise<Object>} - Created user object
   */
  async create(userData) {
    const query = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      // In a real application, you would hash the password here
      const passwordHash = userData.password; // Replace with proper hashing

      const [result] = await this.pool.execute(query, [
        userData.username,
        userData.email,
        passwordHash,
        userData.firstName || null,
        userData.lastName || null,
        userData.role || 'user'
      ]);

      // Return the created user (without password)
      return {
        id: result.insertId,
        username: userData.username,
        email: userData.email,
        first_name: userData.firstName || null,
        last_name: userData.lastName || null,
        role: userData.role || 'user',
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error in UserModel.create:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} - Updated user object
   */
  async update(id, userData) {
    // Build the SET part of the query dynamically based on provided fields
    const setFields = [];
    const values = [];

    if (userData.username) {
      setFields.push('username = ?');
      values.push(userData.username);
    }

    if (userData.email) {
      setFields.push('email = ?');
      values.push(userData.email);
    }

    if (userData.password) {
      // In a real application, you would hash the password here
      setFields.push('password_hash = ?');
      values.push(userData.password); // Replace with proper hashing
    }

    if (userData.firstName !== undefined) {
      setFields.push('first_name = ?');
      values.push(userData.firstName);
    }

    if (userData.lastName !== undefined) {
      setFields.push('last_name = ?');
      values.push(userData.lastName);
    }

    if (userData.role) {
      setFields.push('role = ?');
      values.push(userData.role);
    }

    setFields.push('updated_at = NOW()');

    // If no fields to update, return the user as is
    if (setFields.length === 1) {
      return this.findById(id);
    }

    // Add the ID to the values array
    values.push(id);

    const query = `
      UPDATE users
      SET ${setFields.join(', ')}
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, values);

      // Return the updated user
      return this.findById(id);
    } catch (error) {
      console.error(`Error in UserModel.update for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - True if deleted, false otherwise
   */
  async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = ?
    `;

    try {
      const [result] = await this.pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in UserModel.delete for id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = UserModel;
