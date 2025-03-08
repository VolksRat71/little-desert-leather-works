# Client Documentation

## Overview

The client application is a React-based web application built with Create React App. It communicates with the backend services through AWS API Gateway, which routes requests to the appropriate Lambda functions.

## Directory Structure

```
client/
├── public/              # Static files
├── src/
│   ├── api/             # API integration layer
│   │   ├── auth/        # Authentication API
│   │   ├── marketing/   # Marketing API
│   │   ├── orders/      # Orders API
│   │   ├── products/    # Products API
│   │   ├── users/       # Users API
│   │   ├── client.js    # API client configuration
│   │   ├── index.js     # API exports
│   │   └── placeholder.js # Placeholder data for development
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.js           # Main application component
│   └── index.js         # Application entry point
└── package.json         # Dependencies and scripts
```

## API Integration

The client application uses a modular approach to API integration, with each domain having its own dedicated module:

### API Client (`api/client.js`)

The API client is built using Axios and provides a centralized configuration for all API requests:

```javascript
import axios from 'axios';

// Create a base API client with default configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.littledesertleatherworks.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized - handle logout or token refresh
        console.error('Unauthorized access. Please log in again.');
      }
      if (error.response.status === 403) {
        // Forbidden - handle permission denied
        console.error('Permission denied.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Modules

Each API module (users, products, orders, etc.) follows the same pattern:

```javascript
import apiClient from '../client';

// Get all items
export const getItems = async () => {
  try {
    const response = await apiClient.get('/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Get item by ID
export const getItemById = async (itemId) => {
  try {
    const response = await apiClient.get(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    throw error;
  }
};

// Create a new item
export const createItem = async (itemData) => {
  try {
    const response = await apiClient.post('/items', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Update an existing item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await apiClient.put(`/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${itemId}:`, error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (itemId) => {
  try {
    const response = await apiClient.delete(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
};
```

### API Index (`api/index.js`)

The API index file exports all API modules for easy access throughout the application:

```javascript
import * as productsApi from './products';
import * as usersApi from './users';
import * as ordersApi from './orders';
import * as marketingApi from './marketing';
import * as authApi from './auth';

export { default as apiClient } from './client';

// Organize exports by domain
export const api = {
  products: productsApi,
  users: usersApi,
  orders: ordersApi,
  marketing: marketingApi,
  auth: authApi
};

// Default export for convenience
export default api;
```

## Environment Configuration

The client application uses environment variables for configuration. Create a `.env` file in the client directory with the following variables:

```
REACT_APP_API_URL=https://api.littledesertleatherworks.com
REACT_APP_STAGE=production
```

For local development, create a `.env.development` file:

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STAGE=development
```

## Deployment

The client application is deployed to AWS S3 and served through CloudFront for global distribution. The deployment process is automated using GitHub Actions.

### Deployment Steps

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to S3:
   ```
   aws s3 sync build/ s3://little-desert-leather-works-website/ --delete
   ```

3. Invalidate CloudFront cache:
   ```
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   ```

## Development

To run the application locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run tests with:

```
npm test
```

## Building for Production

Build the application for production with:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.
