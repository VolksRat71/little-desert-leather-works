import apiClient from '../client';
import { orders } from './placeholder';

// Get all orders (admin only)
export const getOrders = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/orders');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get(`/orders/${orderId}`);
    // return response.data;

    // Return placeholder data instead
    const order = orders.find(o => o.id === orderId);
    return Promise.resolve(order || null);
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Get current user's orders
export const getCurrentUserOrders = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/orders/me');
    // return response.data;

    // Return placeholder data instead - assuming user ID 1
    const userOrders = orders.filter(o => o.userId === 1);
    return Promise.resolve(userOrders);
  } catch (error) {
    console.error('Error fetching current user orders:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/orders', orderData);
    // return response.data;

    // Return placeholder data instead
    const newOrder = {
      ...orderData,
      id: Math.max(...orders.map(o => o.id)) + 1,
      orderDate: new Date().toISOString().split('T')[0]
    };
    return Promise.resolve(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update an order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    // return response.data;

    // Return placeholder data instead
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    const updatedOrder = { ...order, status };
    return Promise.resolve(updatedOrder);
  } catch (error) {
    console.error(`Error updating order status for order ${orderId}:`, error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId, reason) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason });
    // return response.data;

    // Return placeholder data instead
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    const updatedOrder = {
      ...order,
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    };
    return Promise.resolve(updatedOrder);
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};
