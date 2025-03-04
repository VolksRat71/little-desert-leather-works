import {
  productSchema,
  userSchema,
  orderSchema,
  testimonialSchema,
  campaignSchema
} from './schema';

/**
 * Validate data against a schema
 * @param {Object} data - The data to validate
 * @param {Object} schema - The Yup schema to validate against
 * @returns {Promise<Object>} - { isValid, errors, values }
 */
export const validate = async (data, schema) => {
  try {
    // Yup validation returns the validated data when successful
    const validData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    return {
      isValid: true,
      errors: null,
      values: validData
    };
  } catch (error) {
    // Format validation errors
    const validationErrors = formatValidationErrors(error);

    return {
      isValid: false,
      errors: validationErrors,
      values: data
    };
  }
};

/**
 * Validate product data
 * @param {Object} productData - The product data to validate
 * @returns {Promise<Object>} - { isValid, errors, values }
 */
export const validateProduct = (productData) => {
  return validate(productData, productSchema);
};

/**
 * Validate user data
 * @param {Object} userData - The user data to validate
 * @returns {Promise<Object>} - { isValid, errors, values }
 */
export const validateUser = (userData) => {
  return validate(userData, userSchema);
};

/**
 * Validate order data
 * @param {Object} orderData - The order data to validate
 * @returns {Promise<Object>} - { isValid, errors, values }
 */
export const validateOrder = (orderData) => {
  return validate(orderData, orderSchema);
};

/**
 * Validate testimonial data
 * @param {Object} testimonialData - The testimonial data to validate
 * @returns {Promise<Object>} - { isValid, errors, values }
 */
export const validateTestimonial = (testimonialData) => {
  return validate(testimonialData, testimonialSchema);
};

/**
 * Validate campaign data
 * @param {Object} campaignData - The campaign data to validate
 * @returns {Promise<Object>} - { isValid, errors, values }
 */
export const validateCampaign = (campaignData) => {
  return validate(campaignData, campaignSchema);
};

/**
 * Format validation errors into a user-friendly object
 * @param {Object} error - The Yup validation error
 * @returns {Object} - An object with field names as keys and error messages as values
 */
export const formatValidationErrors = (error) => {
  if (!error || !error.inner) {
    return null;
  }

  return error.inner.reduce((acc, curr) => {
    if (!acc[curr.path]) {
      acc[curr.path] = curr.message;
    }
    return acc;
  }, {});
};

// For use with React Hook Form
export const getYupResolver = (schema) => {
  return async (data) => {
    try {
      const values = await schema.validate(data, {
        abortEarly: false
      });

      return {
        values,
        errors: {}
      };
    } catch (error) {
      return {
        values: {},
        errors: error.inner.reduce(
          (allErrors, currentError) => ({
            ...allErrors,
            [currentError.path]: {
              type: currentError.type ?? "validation",
              message: currentError.message
            }
          }),
          {}
        )
      };
    }
  };
};

export default {
  validate,
  validateProduct,
  validateUser,
  validateOrder,
  validateTestimonial,
  validateCampaign,
  formatValidationErrors,
  getYupResolver
};
