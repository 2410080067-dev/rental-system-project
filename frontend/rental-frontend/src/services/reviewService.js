import API from './api';

/**
 * Review Service — handles review and rating API calls
 */

export const createReview = async (userId, reviewData) => {
  const response = await API.post(`/api/reviews?userId=${userId}`, reviewData);
  return response.data;
};

export const getReviewsByVehicleId = async (vehicleId) => {
  const response = await API.get(`/api/reviews/vehicle/${vehicleId}`);
  return response.data;
};

export const getReviewsByUserId = async (userId) => {
  const response = await API.get(`/api/reviews/user/${userId}`);
  return response.data;
};

export const getAverageRating = async (vehicleId) => {
  const response = await API.get(`/api/reviews/vehicle/${vehicleId}/rating`);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await API.delete(`/api/reviews/${id}`);
  return response.data;
};
