import API from './api';

/**
 * Booking Service — handles all booking-related API calls
 */

export const createBooking = async ({ userId, vehicleId, startDate, endDate }) => {
  const response = await API.post(
    `/api/bookings?userId=${userId}&vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getAllBookings = async () => {
  const response = await API.get('/api/bookings');
  return response.data;
};

export const getBookingsByUserId = async (userId) => {
  const response = await API.get(`/api/bookings/user/${userId}`);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await API.get(`/api/bookings/${id}`);
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await API.put(`/api/bookings/${id}/approve`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await API.put(`/api/bookings/${id}/cancel`);
  return response.data;
};

export const completeBooking = async (id) => {
  const response = await API.put(`/api/bookings/${id}/complete`);
  return response.data;
};
