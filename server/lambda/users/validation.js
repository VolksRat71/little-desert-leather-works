/**
 * Validation module for user data
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUsername(username) {
  // Usernames should be 3-20 characters and only alphanumeric + underscore
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isStrongPassword(password) {
  // Password should be at least 8 characters
  // In a real application, you would have stronger requirements
  return typeof password === 'string' && password.length >= 8;
}

/**
 * Validates user role
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidRole(role) {
  const validRoles = ['user', 'admin', 'editor'];
  return validRoles.includes(role);
}

/**
 * Validates data for creating a new user
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateCreateUser(userData) {
  const errors = [];

  // Required fields
  if (!userData.username) {
    errors.push('Username is required');
  } else if (!isValidUsername(userData.username)) {
    errors.push('Username must be 3-20 characters and only contain letters, numbers, and underscores');
  }

  if (!userData.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(userData.email)) {
    errors.push('Email format is invalid');
  }

  if (!userData.password) {
    errors.push('Password is required');
  } else if (!isStrongPassword(userData.password)) {
    errors.push('Password must be at least 8 characters long');
  }

  // Optional fields
  if (userData.role && !isValidRole(userData.role)) {
    errors.push('Invalid role. Must be one of: user, admin, editor');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for updating an existing user
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateUpdateUser(userData) {
  const errors = [];

  // All fields are optional for updates, but we validate them if provided
  if (userData.username && !isValidUsername(userData.username)) {
    errors.push('Username must be 3-20 characters and only contain letters, numbers, and underscores');
  }

  if (userData.email && !isValidEmail(userData.email)) {
    errors.push('Email format is invalid');
  }

  if (userData.password && !isStrongPassword(userData.password)) {
    errors.push('Password must be at least 8 characters long');
  }

  if (userData.role && !isValidRole(userData.role)) {
    errors.push('Invalid role. Must be one of: user, admin, editor');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export the validation functions
exports.validate = {
  createUser: validateCreateUser,
  updateUser: validateUpdateUser
};
