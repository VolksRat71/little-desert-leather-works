import apiClient from '../client';
import { products } from './placeholder';

// Get all products
export const getProducts = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/products');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get(`/products/${productId}`);
    // return response.data;

    // Return placeholder data instead
    const product = products.find(p => p.id === productId);
    return Promise.resolve(product || null);
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/products', productData);
    // return response.data;

    // Return placeholder data instead
    const newProduct = {
      ...productData,
      id: Math.max(...products.map(p => p.id)) + 1
    };
    return Promise.resolve(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put(`/products/${productId}`, productData);
    // return response.data;

    // Return placeholder data instead
    const updatedProduct = { ...productData, id: productId };
    return Promise.resolve(updatedProduct);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.delete(`/products/${productId}`);
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve({ success: true, message: `Product ${productId} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};
