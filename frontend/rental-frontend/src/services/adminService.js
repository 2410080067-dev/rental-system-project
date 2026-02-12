import API from './api';

/**
 * Admin Service — dashboard statistics
 */

export const getDashboardStats = async () => {
  const response = await API.get('/api/admin/dashboard');
  return response.data;
};
