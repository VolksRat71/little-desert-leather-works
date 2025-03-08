// Auth data placeholders - importing users from users placeholder to keep data consistent
import { users } from '../users/placeholder';

// Sample tokens structure
export const tokens = {
  validResetTokens: [
    'reset-token-12345-67890-abcde',
    'reset-token-09876-54321-fghij'
  ],
  validEmailVerificationTokens: [
    'verify-email-12345-67890-abcde',
    'verify-email-09876-54321-fghij'
  ]
};

// Helper function to simulate login validation
export const validateCredentials = (email, password) => {
  // In a real app, passwords would be hashed
  // This is just for simulation purposes
  const user = users.find(u => u.email === email);

  // For demo purposes, we'll accept any password for the sample users
  if (user) {
    return {
      success: true,
      user
    };
  }

  return {
    success: false,
    message: 'Invalid email or password'
  };
};

export default {
  users,
  tokens,
  validateCredentials
};
