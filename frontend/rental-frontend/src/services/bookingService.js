import API from './api';

/**
 * Service for handling booking-related API calls
 */

export const createBooking = async (bookingData) => {
  try {
    const response = await API.post('/bookings/book', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await API.get('/bookings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookingsByUserId = async (userId) => {
  try {
    const response = await API.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await API.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await API.put(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
