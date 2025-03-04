import axios from 'axios';

// Create a base API client with default configuration
const apiClient = axios.create({
  // Replace with your actual API base URL in production
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
        // You might want to redirect to login page or refresh token
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
