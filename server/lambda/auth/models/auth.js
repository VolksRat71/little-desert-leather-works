/**
 * Auth Model
 * Handles all authentication-related database operations
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class AuthModel {
  constructor(dbPool) {
    this.pool = dbPool;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable
    this.tokenExpiration = process.env.TOKEN_EXPIRATION || '24h';
  }

  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise<Object>} - Created user and token
   */
  async register(userData) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Start a transaction
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if email already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      // Insert the user
      const [result] = await connection.execute(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userData.username,
          userData.email,
          passwordHash,
          userData.firstName || null,
          userData.lastName || null,
          userData.role || 'user'
        ]
      );

      const userId = result.insertId;

      // If marketing preferences are provided, store them
      if (userData.marketingPreferences) {
        await connection.execute(
          `INSERT INTO user_preferences (user_id, email_offers, text_offers, order_updates)
           VALUES (?, ?, ?, ?)`,
          [
            userId,
            userData.marketingPreferences.emailOffers ? 1 : 0,
            userData.marketingPreferences.textOffers ? 1 : 0,
            userData.marketingPreferences.orderUpdates ? 1 : 0
          ]
        );
      }

      // Create email verification token
      const verificationToken = uuidv4();
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hour expiry

      await connection.execute(
        `INSERT INTO verification_tokens (user_id, token, type, expires_at)
         VALUES (?, ?, ?, ?)`,
        [userId, verificationToken, 'email_verification', tokenExpiry]
      );

      // Commit the transaction
      await connection.commit();

      // Generate JWT token
      const token = this.generateToken(userId);

      // Get the user (without password)
      const user = await this.getUserById(userId);

      return {
        user,
        token,
        verificationToken // In production, this should be sent via email, not returned in the response
      };
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User and token
   */
  async login(email, password) {
    // Get the user with password hash
    const [users] = await this.pool.execute(
      `SELECT id, password_hash
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login timestamp
    await this.pool.execute(
      `UPDATE users SET last_login = NOW() WHERE id = ?`,
      [user.id]
    );

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Get user data without password
    const userData = await this.getUserById(user.id);

    return {
      user: userData,
      token
    };
  }

  /**
   * Get user by ID (without sensitive data)
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async getUserById(userId) {
    const [rows] = await this.pool.execute(
      `SELECT id, username, email, first_name, last_name, role, created_at, updated_at, last_login,
              (SELECT json_object(
                'email_offers', email_offers,
                'text_offers', text_offers,
                'order_updates', order_updates
              ) FROM user_preferences WHERE user_id = users.id) as marketing_preferences
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    // Parse marketing preferences
    const user = rows[0];
    if (user.marketing_preferences) {
      user.marketing_preferences = JSON.parse(user.marketing_preferences);
    } else {
      user.marketing_preferences = {
        emailOffers: false,
        textOffers: false,
        orderUpdates: true
      };
    }

    return user;
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<string|null>} - Reset token or null if email not found
   */
  async requestPasswordReset(email) {
    // Check if user exists
    const [users] = await this.pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return null; // Don't reveal that the email doesn't exist
    }

    const userId = users[0].id;

    // Create reset token
    const resetToken = uuidv4();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // 1 hour expiry

    // Remove any existing reset tokens for this user
    await this.pool.execute(
      'DELETE FROM verification_tokens WHERE user_id = ? AND type = ?',
      [userId, 'password_reset']
    );

    // Store the new token
    await this.pool.execute(
      `INSERT INTO verification_tokens (user_id, token, type, expires_at)
       VALUES (?, ?, ?, ?)`,
      [userId, resetToken, 'password_reset', tokenExpiry]
    );

    return resetToken; // In production, this should be sent via email, not returned
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - True if successful, false otherwise
   */
  async resetPassword(token, newPassword) {
    // Check if token exists and is valid
    const [tokens] = await this.pool.execute(
      `SELECT user_id, expires_at
       FROM verification_tokens
       WHERE token = ? AND type = ?`,
      [token, 'password_reset']
    );

    if (tokens.length === 0) {
      throw new Error('Invalid or expired token');
    }

    const { user_id, expires_at } = tokens[0];

    // Check if token is expired
    if (new Date() > new Date(expires_at)) {
      throw new Error('Token has expired');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the password
    await this.pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, user_id]
    );

    // Delete the used token
    await this.pool.execute(
      'DELETE FROM verification_tokens WHERE token = ?',
      [token]
    );

    return true;
  }

  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} - True if successful, false otherwise
   */
  async verifyEmail(token) {
    // Check if token exists and is valid
    const [tokens] = await this.pool.execute(
      `SELECT user_id, expires_at
       FROM verification_tokens
       WHERE token = ? AND type = ?`,
      [token, 'email_verification']
    );

    if (tokens.length === 0) {
      throw new Error('Invalid or expired token');
    }

    const { user_id, expires_at } = tokens[0];

    // Check if token is expired
    if (new Date() > new Date(expires_at)) {
      throw new Error('Token has expired');
    }

    // Mark the email as verified
    await this.pool.execute(
      'UPDATE users SET email_verified = 1 WHERE id = ?',
      [user_id]
    );

    // Delete the used token
    await this.pool.execute(
      'DELETE FROM verification_tokens WHERE token = ?',
      [token]
    );

    return true;
  }

  /**
   * Update user marketing preferences
   * @param {number} userId - User ID
   * @param {Object} preferences - Marketing preferences
   * @returns {Promise<Object>} - Updated user
   */
  async updateMarketingPreferences(userId, preferences) {
    // Check if preferences already exist
    const [existingPrefs] = await this.pool.execute(
      'SELECT user_id FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    if (existingPrefs.length === 0) {
      // Insert new preferences
      await this.pool.execute(
        `INSERT INTO user_preferences (user_id, email_offers, text_offers, order_updates)
         VALUES (?, ?, ?, ?)`,
        [
          userId,
          preferences.emailOffers ? 1 : 0,
          preferences.textOffers ? 1 : 0,
          preferences.orderUpdates ? 1 : 0
        ]
      );
    } else {
      // Update existing preferences
      await this.pool.execute(
        `UPDATE user_preferences
         SET email_offers = ?, text_offers = ?, order_updates = ?
         WHERE user_id = ?`,
        [
          preferences.emailOffers ? 1 : 0,
          preferences.textOffers ? 1 : 0,
          preferences.orderUpdates ? 1 : 0,
          userId
        ]
      );
    }

    // Return updated user
    return this.getUserById(userId);
  }

  /**
   * Generate JWT token
   * @param {number} userId - User ID
   * @returns {string} - JWT token
   */
  generateToken(userId) {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.tokenExpiration
    });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} - Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthModel;
