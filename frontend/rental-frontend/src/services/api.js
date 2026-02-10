import axios from 'axios';

/**
 * Axios instance configured for API communication
 * Base URL points to Spring Boot backend on port 8081
 */
const API = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include user token if available
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    // Log outgoing request for debugging connectivity
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url, config.data || '');
    if (user) {
      // placeholder for auth header if needed in future
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to log responses and capture network errors
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message, error.response || 'no response');
    return Promise.reject(error);
  }
);

export default API;
