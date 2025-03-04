import apiClient from '../client';
import { users } from './placeholder';

// Get all users (admin only)
export const getUsers = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/users');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get(`/users/${userId}`);
    // return response.data;

    // Return placeholder data instead
    const user = users.find(u => u.id === userId);
    return Promise.resolve(user || null);
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Get current user's profile
export const getCurrentUser = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/users/me');
    // return response.data;

    // Return first user as the current user for demo
    return Promise.resolve(users[0] || null);
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/users', userData);
    // return response.data;

    // Return placeholder data instead
    const newUser = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1
    };
    return Promise.resolve(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId, userData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put(`/users/${userId}`, userData);
    // return response.data;

    // Return placeholder data instead
    const updatedUser = { ...userData, id: userId };
    return Promise.resolve(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Update current user's profile
export const updateCurrentUser = async (userData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put('/users/me', userData);
    // return response.data;

    // Return placeholder data instead
    const updatedUser = { ...users[0], ...userData };
    return Promise.resolve(updatedUser);
  } catch (error) {
    console.error('Error updating current user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.delete(`/users/${userId}`);
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve({ success: true, message: `User ${userId} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
