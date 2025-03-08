/**
 * Validation module for authentication data
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
  // In a real application, you might want stronger requirements
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
 * Validates marketing preferences
 * @param {Object} preferences - Marketing preferences to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidMarketingPreferences(preferences) {
  if (!preferences || typeof preferences !== 'object') {
    return false;
  }

  // Check if all fields are boolean
  return (
    (preferences.emailOffers === undefined || typeof preferences.emailOffers === 'boolean') &&
    (preferences.textOffers === undefined || typeof preferences.textOffers === 'boolean') &&
    (preferences.orderUpdates === undefined || typeof preferences.orderUpdates === 'boolean')
  );
}

/**
 * Validates data for user registration
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateRegister(userData) {
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

  if (userData.marketingPreferences && !isValidMarketingPreferences(userData.marketingPreferences)) {
    errors.push('Invalid marketing preferences format');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for user login
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateLogin(userData) {
  const errors = [];

  if (!userData.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(userData.email)) {
    errors.push('Email format is invalid');
  }

  if (!userData.password) {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for password reset request
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validatePasswordResetRequest(userData) {
  const errors = [];

  if (!userData.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(userData.email)) {
    errors.push('Email format is invalid');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for password reset confirmation
 * @param {Object} resetData - Password reset data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validatePasswordReset(resetData) {
  const errors = [];

  if (!resetData.token) {
    errors.push('Token is required');
  }

  if (!resetData.newPassword) {
    errors.push('New password is required');
  } else if (!isStrongPassword(resetData.newPassword)) {
    errors.push('New password must be at least 8 characters long');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for email verification
 * @param {Object} verifyData - Email verification data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateEmailVerification(verifyData) {
  const errors = [];

  if (!verifyData.token) {
    errors.push('Token is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for marketing preferences update
 * @param {Object} preferencesData - Marketing preferences data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateMarketingPreferences(preferencesData) {
  const errors = [];

  if (!preferencesData) {
    errors.push('Preferences data is required');
    return { valid: false, errors };
  }

  if (!isValidMarketingPreferences(preferencesData)) {
    errors.push('Invalid marketing preferences format');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export the validation functions
exports.validate = {
  register: validateRegister,
  login: validateLogin,
  passwordResetRequest: validatePasswordResetRequest,
  passwordReset: validatePasswordReset,
  emailVerification: validateEmailVerification,
  marketingPreferences: validateMarketingPreferences
};
