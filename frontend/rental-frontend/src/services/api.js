import axios from 'axios';

/**
 * Axios instance configured for API communication
 * Uses REACT_APP_API_URL env var in production, falls back to localhost for dev
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired) globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      // Don't redirect if already on a public page
      const publicPaths = ['/login', '/register', '/vehicles', '/'];
      const currentPath = window.location.pathname;
      if (!publicPaths.some(p => currentPath === p || currentPath.startsWith('/vehicles/'))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
