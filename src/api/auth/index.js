import apiClient from '../client';
import { users, validateCredentials, tokens } from './placeholder';

// User login
export const login = async (email, password) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/auth/login', { email, password });
    // if (response.data && response.data.token) {
    //   localStorage.setItem('auth_token', response.data.token);
    // }
    // return response.data;

    // Simulate login with placeholder data
    const validation = validateCredentials(email, password);
    if (!validation.success) {
      // Simulate API error for invalid credentials
      throw new Error('Invalid email or password');
    }

    // Create a mock token
    const mockToken = `mock-token-${Date.now()}-${validation.user.id}`;
    localStorage.setItem('auth_token', mockToken);

    return Promise.resolve({
      user: { ...validation.user, password: undefined }, // Never return the password
      token: mockToken
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// User registration
export const register = async (userData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/auth/register', userData);
    // if (response.data && response.data.token) {
    //   localStorage.setItem('auth_token', response.data.token);
    // }
    // return response.data;

    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create a new user
    const newUser = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1,
      role: 'User',
      marketingPreferences: userData.marketingPreferences || {
        emailOffers: false,
        textOffers: false,
        orderUpdates: true
      }
    };

    // Create a mock token
    const mockToken = `mock-token-${Date.now()}-${newUser.id}`;
    localStorage.setItem('auth_token', mockToken);

    return Promise.resolve({
      user: { ...newUser, password: undefined }, // Never return the password
      token: mockToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// User logout
export const logout = () => {
  try {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Password reset request
export const requestPasswordReset = async (email) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/auth/forgot-password', { email });
    // return response.data;

    // Simulate password reset request
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal that the email doesn't exist (security best practice)
      return Promise.resolve({
        success: true,
        message: 'If your email is in our system, you will receive a password reset link shortly'
      });
    }

    return Promise.resolve({
      success: true,
      message: 'If your email is in our system, you will receive a password reset link shortly'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

// Password reset confirmation
export const resetPassword = async (token, newPassword) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    // return response.data;

    // Simulate password reset
    // Validate the token against our placeholder data
    if (!token || !tokens.validResetTokens.includes(token)) {
      throw new Error('Invalid or expired token');
    }

    return Promise.resolve({
      success: true,
      message: 'Your password has been reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/auth/verify-email', { token });
    // return response.data;

    // Simulate email verification
    // Validate the token against our placeholder data
    if (!token || !tokens.validEmailVerificationTokens.includes(token)) {
      throw new Error('Invalid or expired token');
    }

    return Promise.resolve({
      success: true,
      message: 'Your email has been verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const checkAuth = () => {
  return !!localStorage.getItem('auth_token');
};
