// Import and re-export all placeholder data from a single file
import { products } from './products/placeholder';
import { users } from './users/placeholder';
import { orders } from './orders/placeholder';
import { testimonials, marketingCampaigns } from './marketing/placeholder';
import { tokens, validateCredentials } from './auth/placeholder';

// Export everything
export {
  products,
  users,
  orders,
  testimonials,
  marketingCampaigns,
  tokens,
  validateCredentials
};

// Export by domain
export const placeholder = {
  products: {
    all: products,
    count: products.length
  },
  users: {
    all: users,
    count: users.length
  },
  orders: {
    all: orders,
    count: orders.length
  },
  marketing: {
    testimonials,
    campaigns: marketingCampaigns,
    testimonialCount: testimonials.length,
    campaignCount: marketingCampaigns.length
  },
  auth: {
    tokens,
    validateCredentials
  }
};

export default placeholder;
