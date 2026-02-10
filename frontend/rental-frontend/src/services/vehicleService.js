import API from './api';

/**
 * Service for handling vehicle-related API calls
 */

export const getAllVehicles = async () => {
  try {
    const response = await API.get('/api/vehicles');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAvailableVehicles = async () => {
  try {
    const response = await API.get('/api/vehicles/available');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await API.get(`/api/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehiclesByCategory = async (category) => {
  try {
    const response = await API.get(`/api/vehicles/category/${category}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addVehicle = async (vehicleData) => {
  try {
    const response = await API.post('/api/vehicles/add', vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateVehicle = async (id, vehicleData) => {
  try {
    const response = await API.put(`/api/vehicles/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await API.delete(`/api/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
