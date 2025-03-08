/**
 * Validation module for marketing data
 */

/**
 * Validates rating value
 * @param {number} rating - Rating to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Validates discount percentage
 * @param {number} percentage - Percentage to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidDiscountPercentage(percentage) {
  return (
    typeof percentage === 'number' &&
    !isNaN(percentage) &&
    percentage > 0 &&
    percentage <= 100
  );
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidDate(dateString) {
  if (!dateString) return true; // Allow null/undefined dates

  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  // Check if it's a valid date
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validates testimonial data
 * @param {Object} testimonialData - Testimonial data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateTestimonial(testimonialData) {
  const errors = [];

  // Required fields
  if (!testimonialData.customerName) {
    errors.push('Customer name is required');
  } else if (testimonialData.customerName.length < 2 || testimonialData.customerName.length > 100) {
    errors.push('Customer name must be between 2 and 100 characters');
  }

  if (!testimonialData.content) {
    errors.push('Testimonial content is required');
  } else if (testimonialData.content.length < 10 || testimonialData.content.length > 1000) {
    errors.push('Testimonial content must be between 10 and 1000 characters');
  }

  if (testimonialData.rating === undefined) {
    errors.push('Rating is required');
  } else if (!isValidRating(testimonialData.rating)) {
    errors.push('Rating must be an integer between 1 and 5');
  }

  // Optional fields
  if (testimonialData.isFeatured !== undefined && typeof testimonialData.isFeatured !== 'boolean') {
    errors.push('Featured flag must be a boolean value');
  }

  if (testimonialData.isApproved !== undefined && typeof testimonialData.isApproved !== 'boolean') {
    errors.push('Approved flag must be a boolean value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates campaign data
 * @param {Object} campaignData - Campaign data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateCampaign(campaignData) {
  const errors = [];

  // Required fields
  if (!campaignData.name) {
    errors.push('Campaign name is required');
  } else if (campaignData.name.length < 3 || campaignData.name.length > 100) {
    errors.push('Campaign name must be between 3 and 100 characters');
  }

  if (!campaignData.description) {
    errors.push('Campaign description is required');
  } else if (campaignData.description.length < 10 || campaignData.description.length > 1000) {
    errors.push('Campaign description must be between 10 and 1000 characters');
  }

  if (!campaignData.startDate) {
    errors.push('Start date is required');
  } else if (!isValidDate(campaignData.startDate)) {
    errors.push('Start date must be a valid date in YYYY-MM-DD format');
  }

  if (campaignData.endDate && !isValidDate(campaignData.endDate)) {
    errors.push('End date must be a valid date in YYYY-MM-DD format');
  }

  if (campaignData.startDate && campaignData.endDate) {
    const start = new Date(campaignData.startDate);
    const end = new Date(campaignData.endDate);
    if (start > end) {
      errors.push('End date must be after start date');
    }
  }

  if (!campaignData.discountCode) {
    errors.push('Discount code is required');
  } else if (campaignData.discountCode.length < 3 || campaignData.discountCode.length > 20) {
    errors.push('Discount code must be between 3 and 20 characters');
  }

  if (campaignData.discountPercentage === undefined) {
    errors.push('Discount percentage is required');
  } else if (!isValidDiscountPercentage(campaignData.discountPercentage)) {
    errors.push('Discount percentage must be a number between 1 and 100');
  }

  // Optional fields
  if (campaignData.isActive !== undefined && typeof campaignData.isActive !== 'boolean') {
    errors.push('Active flag must be a boolean value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates contact information
 * @param {Object} contactData - Contact data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateContactInfo(contactData) {
  const errors = [];

  // Required fields
  if (!contactData.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
    errors.push('Email format is invalid');
  }

  if (!contactData.phone) {
    errors.push('Phone number is required');
  }

  if (!contactData.address) {
    errors.push('Address is required');
  }

  if (!contactData.hours) {
    errors.push('Business hours are required');
  }

  // Optional fields
  if (contactData.showMap !== undefined && typeof contactData.showMap !== 'boolean') {
    errors.push('Show map flag must be a boolean value');
  }

  if (contactData.showAddress !== undefined && typeof contactData.showAddress !== 'boolean') {
    errors.push('Show address flag must be a boolean value');
  }

  if (contactData.showPhone !== undefined && typeof contactData.showPhone !== 'boolean') {
    errors.push('Show phone flag must be a boolean value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates artisan information
 * @param {Object} artisanData - Artisan data to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validateArtisanInfo(artisanData) {
  const errors = [];

  // Required fields
  if (!artisanData.name) {
    errors.push('Name is required');
  }

  if (!artisanData.title) {
    errors.push('Title is required');
  }

  if (!artisanData.image) {
    errors.push('Image URL is required');
  }

  if (!artisanData.bio) {
    errors.push('Bio is required');
  }

  if (!artisanData.philosophy) {
    errors.push('Philosophy is required');
  }

  if (!artisanData.skills || !Array.isArray(artisanData.skills) || artisanData.skills.length === 0) {
    errors.push('Skills must be a non-empty array');
  }

  // Optional fields
  if (artisanData.isVisible !== undefined && typeof artisanData.isVisible !== 'boolean') {
    errors.push('Visibility flag must be a boolean value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export the validation functions
exports.validate = {
  testimonial: validateTestimonial,
  campaign: validateCampaign,
  contactInfo: validateContactInfo,
  artisanInfo: validateArtisanInfo
};
