import API from './api';

/**
 * Authentication Service — JWT-based auth with role support
 */

export const register = async (userData) => {
  try {
   const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
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
      // Store JWT token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);
    }
    return response.data;
  } catch (error) {
    const serverMessage = error.response?.data?.message || error.message || 'Network or server error';
    throw new Error(serverMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const isAdmin = () => {
  const role = localStorage.getItem('userRole');
  return role === 'ADMIN';
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};
