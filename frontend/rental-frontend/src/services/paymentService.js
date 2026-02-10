import API from './api';

/**
 * Service for handling payment-related API calls
 */

export const processPayment = async (paymentData) => {
  try {
    const response = await API.post('/payment', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPaymentByBookingId = async (bookingId) => {
  try {
    const response = await API.get(`/payment/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
