import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/api/users/profile');
    return unwrapApiResponse(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return unwrapApiResponse(response);
  },

  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/users', { params });
    return unwrapApiResponse(response);
  },

  update: async (id, payload) => {
    const response = await apiClient.put(`/api/users/${id}`, payload);
    return unwrapApiResponse(response);
  },

  changePassword: async (payload) => {
    const response = await apiClient.post('/api/users/change-password', payload);
    return unwrapApiResponse(response);
  },

  remove: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return unwrapApiResponse(response);
  },
};
