/**
 * Validation module for order data
 */

/**
 * Validates price format
 * @param {number|string} price - Price to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidPrice(price) {
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if it's a valid number and greater than or equal to zero
  return (
    typeof numPrice === 'number' &&
    !isNaN(numPrice) &&
    numPrice >= 0
  );
}

/**
 * Validates quantity
 * @param {number|string} quantity - Quantity to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidQuantity(quantity) {
  // Convert to number if it's a string
  const numQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

  // Check if it's a valid integer and greater than zero
  return (
    typeof numQuantity === 'number' &&
    !isNaN(numQuantity) &&
    Number.isInteger(numQuantity) &&
    numQuantity > 0
  );
}

/**
 * Validates order status
 * @param {string} status - Status to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidStatus(status) {
  const validStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  ];
  return validStatuses.includes(status.toLowerCase());
}

/**
 * Validates an address object
 * @param {Object} address - Address to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateAddress(address) {
  const errors = [];

  if (!address) {
    errors.push('Address is required');
    return { valid: false, errors };
  }

  if (!address.fullName) {
    errors.push('Full name is required in address');
  }

  if (!address.line1) {
    errors.push('Address line 1 is required');
  }

  if (!address.city) {
    errors.push('City is required in address');
  }

  if (!address.state) {
    errors.push('State is required in address');
  }

  if (!address.postalCode) {
    errors.push('Postal code is required in address');
  }

  if (!address.country) {
    errors.push('Country is required in address');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates order items
 * @param {Array} items - Order items to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateOrderItems(items) {
  const errors = [];

  if (!items || !Array.isArray(items)) {
    errors.push('Order items must be an array');
    return { valid: false, errors };
  }

  if (items.length === 0) {
    errors.push('Order must have at least one item');
    return { valid: false, errors };
  }

  items.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`Item at index ${index} is missing a product ID`);
    }

    if (!item.productName) {
      errors.push(`Item at index ${index} is missing a product name`);
    }

    if (!item.quantity) {
      errors.push(`Item at index ${index} is missing a quantity`);
    } else if (!isValidQuantity(item.quantity)) {
      errors.push(`Item at index ${index} has an invalid quantity`);
    }

    if (item.price === undefined || item.price === null) {
      errors.push(`Item at index ${index} is missing a price`);
    } else if (!isValidPrice(item.price)) {
      errors.push(`Item at index ${index} has an invalid price`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for creating a new order
 * @param {Object} orderData - Order data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateCreateOrder(orderData) {
  const errors = [];

  // Required fields
  if (!orderData.userId) {
    errors.push('User ID is required');
  }

  if (orderData.totalAmount === undefined || orderData.totalAmount === null) {
    errors.push('Total amount is required');
  } else if (!isValidPrice(orderData.totalAmount)) {
    errors.push('Total amount must be a valid number and greater than or equal to zero');
  }

  // Validate shipping address
  const shippingAddressValidation = validateAddress(orderData.shippingAddress);
  if (!shippingAddressValidation.valid) {
    errors.push('Invalid shipping address');
    errors.push(...shippingAddressValidation.errors);
  }

  // Validate billing address if provided
  if (orderData.billingAddress) {
    const billingAddressValidation = validateAddress(orderData.billingAddress);
    if (!billingAddressValidation.valid) {
      errors.push('Invalid billing address');
      errors.push(...billingAddressValidation.errors);
    }
  }

  // Validate items
  const itemsValidation = validateOrderItems(orderData.items);
  if (!itemsValidation.valid) {
    errors.push(...itemsValidation.errors);
  }

  // Validate status if provided
  if (orderData.status && !isValidStatus(orderData.status)) {
    errors.push(`Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled, refunded`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for updating an order's status
 * @param {Object} statusData - Status data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateUpdateStatus(statusData) {
  const errors = [];

  if (!statusData.status) {
    errors.push('Status is required');
  } else if (!isValidStatus(statusData.status)) {
    errors.push(`Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled, refunded`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for cancelling an order
 * @param {Object} cancelData - Cancellation data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateCancelOrder(cancelData) {
  const errors = [];

  if (!cancelData.reason) {
    errors.push('Cancellation reason is required');
  } else if (typeof cancelData.reason !== 'string' || cancelData.reason.trim() === '') {
    errors.push('Cancellation reason must be a non-empty string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export the validation functions
exports.validate = {
  createOrder: validateCreateOrder,
  updateStatus: validateUpdateStatus,
  cancelOrder: validateCancelOrder
};
