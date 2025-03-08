# Validators Directory

This directory contains validation schemas and utilities for the Little Desert Leather Works application. The code provides a centralized way to validate data before sending it to the API or using it in the application.

## Directory Structure

```
validators/
├── index.js               # Main entry point with validation utilities
├── schema.js              # Joi schemas for different data models
└── README.md              # This file
```

## Usage

Import and use the validators in your components like this:

```javascript
// Import all validators
import validators from '../validators';

// Validate a product
const { error, value } = validators.validateProduct(productData);
if (error) {
  // Handle validation error
  const formattedErrors = validators.formatValidationErrors(error);
  // formattedErrors = { name: 'Name is required', price: 'Price format is invalid' }
} else {
  // Use the validated data (value)
  api.products.createProduct(value);
}

// Or import specific validators
import { validateUser, formatValidationErrors } from '../validators';

// Then use it directly
const { error, value } = validateUser(userData);
if (error) {
  const formattedErrors = formatValidationErrors(error);
  // Handle errors
}
```

## Validation Schemas

The following validation schemas are available:

- `productSchema`: Validates product data
- `userSchema`: Validates user data
- `orderSchema`: Validates order data
- `testimonialSchema`: Validates testimonial data
- `campaignSchema`: Validates marketing campaign data

## Adding New Schemas

When adding new validation schemas:

1. Add the schema to `schema.js`
2. Create a validation function in `index.js`
3. Export the function from `index.js`

## Validation Options

The `validate` function accepts options that are passed to Joi:

```javascript
const { error, value } = validators.validate(data, schema, {
  stripUnknown: false, // Don't remove unknown properties
  abortEarly: true     // Stop on first error
});
```
