// Export the API client
// Export all APIs by category
import * as productsApi from './products';
import * as usersApi from './users';
import * as ordersApi from './orders';
import * as marketingApi from './marketing';
import * as authApi from './auth';

export { default as apiClient } from './client';

// Export the placeholder data
export { default as placeholder } from './placeholder';

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
