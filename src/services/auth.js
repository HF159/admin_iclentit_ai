// src/services/auth.js
// Authentication service for handling login/logout

import apiClient from './apiClient';

export const login = (credentials) => {
  return apiClient.post('/login', credentials);
};

export const getCurrentUser = () => {
  return apiClient.get('/me');
};

// Other auth-related API calls can be added here