/**
 * Validation module for product data
 */

/**
 * Validates price format
 * @param {number|string} price - Price to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidPrice(price) {
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if it's a valid number, greater than zero, and has at most 2 decimal places
  return (
    typeof numPrice === 'number' &&
    !isNaN(numPrice) &&
    numPrice >= 0 &&
    /^\d+(\.\d{1,2})?$/.test(numPrice.toString())
  );
}

/**
 * Validates stock quantity
 * @param {number|string} quantity - Quantity to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidStockQuantity(quantity) {
  // Convert to number if it's a string
  const numQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

  // Check if it's a valid integer and non-negative
  return (
    typeof numQuantity === 'number' &&
    !isNaN(numQuantity) &&
    Number.isInteger(numQuantity) &&
    numQuantity >= 0
  );
}

/**
 * Validates product category
 * @param {string} category - Category to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidCategory(category) {
  const validCategories = [
    'wallets',
    'bags',
    'belts',
    'accessories',
    'custom',
    'care'
  ];
  return validCategories.includes(category.toLowerCase());
}

/**
 * Validates data for creating a new product
 * @param {Object} productData - Product data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateCreateProduct(productData) {
  const errors = [];

  // Required fields
  if (!productData.name) {
    errors.push('Product name is required');
  } else if (productData.name.length < 3 || productData.name.length > 100) {
    errors.push('Product name must be between 3 and 100 characters');
  }

  if (!productData.description) {
    errors.push('Product description is required');
  } else if (productData.description.length < 10 || productData.description.length > 2000) {
    errors.push('Product description must be between 10 and 2000 characters');
  }

  if (productData.price === undefined || productData.price === null) {
    errors.push('Product price is required');
  } else if (!isValidPrice(productData.price)) {
    errors.push('Product price must be a valid positive number with at most 2 decimal places');
  }

  if (!productData.category) {
    errors.push('Product category is required');
  } else if (!isValidCategory(productData.category)) {
    errors.push(`Invalid category. Must be one of: wallets, bags, belts, accessories, custom, care`);
  }

  // Optional fields with validation
  if (productData.stockQuantity !== undefined && !isValidStockQuantity(productData.stockQuantity)) {
    errors.push('Stock quantity must be a non-negative integer');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates data for updating an existing product
 * @param {Object} productData - Product data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateUpdateProduct(productData) {
  const errors = [];

  // All fields are optional for updates, but we validate them if provided
  if (productData.name !== undefined) {
    if (productData.name === '') {
      errors.push('Product name cannot be empty');
    } else if (productData.name && (productData.name.length < 3 || productData.name.length > 100)) {
      errors.push('Product name must be between 3 and 100 characters');
    }
  }

  if (productData.description !== undefined) {
    if (productData.description === '') {
      errors.push('Product description cannot be empty');
    } else if (productData.description && (productData.description.length < 10 || productData.description.length > 2000)) {
      errors.push('Product description must be between 10 and 2000 characters');
    }
  }

  if (productData.price !== undefined && !isValidPrice(productData.price)) {
    errors.push('Product price must be a valid positive number with at most 2 decimal places');
  }

  if (productData.category !== undefined && !isValidCategory(productData.category)) {
    errors.push(`Invalid category. Must be one of: wallets, bags, belts, accessories, custom, care`);
  }

  if (productData.stockQuantity !== undefined && !isValidStockQuantity(productData.stockQuantity)) {
    errors.push('Stock quantity must be a non-negative integer');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export the validation functions
exports.validate = {
  createProduct: validateCreateProduct,
  updateProduct: validateUpdateProduct
};
