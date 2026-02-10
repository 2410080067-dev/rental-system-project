import API from './api';

/**
 * Service for handling authentication-related API calls
 */

export const register = async (userData) => {
  try {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    // Log full error for diagnostics
    console.error('register() error:', error.message, error.response || 'no response');
    const serverMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      'Network or server error';
    throw new Error(serverMessage);
  }
};

export const login = async (email, password) => {
  try {
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data.success) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);
    }
    return response.data;
  } catch (error) {
    console.error('login() error:', error.message, error.response || 'no response');
    const serverMessage = error.response?.data?.message || error.message || 'Network or server error';
    throw new Error(serverMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return localStorage.getItem('user') !== null;
};

export const isAdmin = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.role === 'admin';
  }
  return false;
};
