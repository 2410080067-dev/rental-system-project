import API from './api';

/**
 * Payment Service — handles payment processing API calls
 */

export const processPayment = async ({ bookingId, amount, paymentMethod = 'CREDIT_CARD' }) => {
  const response = await API.post(
    `/api/payment?bookingId=${bookingId}&amount=${amount}&paymentMethod=${encodeURIComponent(paymentMethod)}`
  );
  return response.data;
};

export const getPaymentByBookingId = async (bookingId) => {
  const response = await API.get(`/api/payment/${bookingId}`);
  return response.data;
};
