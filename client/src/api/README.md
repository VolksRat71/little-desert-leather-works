# API Directory

This directory contains all the API interaction code for the Little Desert Leather Works application. The code is organized by domain and provides a clean, consistent interface for making API calls.

## Directory Structure

```
api/
├── client.js              # Base API client with interceptors
├── index.js               # Main entry point that exports all API modules
├── auth/                  # Authentication API (login, register, etc.)
├── products/              # Product-related API calls
├── users/                 # User-related API calls
├── orders/                # Order-related API calls
├── marketing/             # Marketing-related API calls (campaigns, testimonials)
└── README.md              # This file
```

## Usage

Import the API modules in your components like this:

```javascript
// Import all API modules
import api from '../api';

// Use specific API calls
api.products.getProducts().then(products => {
  // Do something with products
});

// Or import specific API domain
import { products } from '../api';

// Then use it directly
products.getProductById(123).then(product => {
  // Do something with product
});

// Import just what you need
import { getProductById } from '../api/products';
```

## Error Handling

All API calls use a consistent error handling pattern:

```javascript
try {
  const products = await api.products.getProducts();
  // Do something with products
} catch (error) {
  // Handle error
  console.error('Failed to fetch products:', error);
}
```

## Authentication

The API client automatically handles authentication tokens:

- Tokens are stored in localStorage
- The client adds the token to all requests
- Handles 401/403 errors with appropriate responses

## Adding New API Endpoints

When adding new API endpoints:

1. Create a new function in the appropriate domain directory
2. Follow the existing pattern for error handling
3. Export the function from the domain's index.js file
4. The main API index.js will automatically include it
