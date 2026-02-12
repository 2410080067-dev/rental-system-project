import API from './api';
import axios from 'axios';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8081') + '/api';

/**
 * Vehicle Service — handles all vehicle-related API calls
 */

export const getAllVehicles = async () => {
  try {
    const response = await API.get('/api/vehicles');
    return response.data;
  } catch (err) {
    // Fallback: try without auth token (public endpoint)
    const response = await axios.get(`${API_BASE}/vehicles`);
    return response.data;
  }
};

export const getAvailableVehicles = async () => {
  try {
    const response = await API.get('/api/vehicles/available');
    return response.data;
  } catch (err) {
    const response = await axios.get(`${API_BASE}/vehicles/available`);
    return response.data;
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await API.get(`/api/vehicles/${id}`);
    return response.data;
  } catch (err) {
    const response = await axios.get(`${API_BASE}/vehicles/${id}`);
    return response.data;
  }
};

export const getVehiclesByCategory = async (category) => {
  try {
    const response = await API.get(`/api/vehicles/category/${category}`);
    return response.data;
  } catch (err) {
    const response = await axios.get(`${API_BASE}/vehicles/category/${category}`);
    return response.data;
  }
};

export const searchVehicles = async (name) => {
  try {
    const response = await API.get(`/api/vehicles/search?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (err) {
    const response = await axios.get(`${API_BASE}/vehicles/search?name=${encodeURIComponent(name)}`);
    return response.data;
  }
};

export const getVehiclesByPriceRange = async (min, max) => {
  try {
    const response = await API.get(`/api/vehicles/price-range?min=${min}&max=${max}`);
    return response.data;
  } catch (err) {
    const response = await axios.get(`${API_BASE}/vehicles/price-range?min=${min}&max=${max}`);
    return response.data;
  }
};

export const addVehicle = async (vehicleData) => {
  const response = await API.post('/api/vehicles', vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await API.put(`/api/vehicles/${id}`, vehicleData);
  return response.data;
};

export const toggleAvailability = async (id) => {
  const response = await API.put(`/api/vehicles/${id}/toggle-availability`);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await API.delete(`/api/vehicles/${id}`);
  return response.data;
};
