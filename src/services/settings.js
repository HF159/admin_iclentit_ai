// src/services/settings.js
// Service for system settings-related API calls

import apiClient from './apiClient';

/**
 * Get token settings
 * @returns {Promise} - Promise that resolves to token settings data
 */
export const getTokenSettings = () => {
  return apiClient.get('/tokens/settings');
};

/**
 * Update token settings
 * @param {Object} settings - Updated token settings
 * @param {number} settings.daily_token_limit - New daily token limit
 * @returns {Promise} - Promise that resolves to updated token settings
 */
export const updateTokenSettings = (settings) => {
  return apiClient.put('/tokens/settings', settings);
};

/**
 * Get all limited/blocked users
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @returns {Promise} - Promise that resolves to limited users data
 */
export const getLimitedUsers = (page = 1, limit = 10) => {
  return apiClient.get(`/users/limited?page=${page}&limit=${limit}`);
};

/**
 * Block a specific user
 * @param {string} userId - User ID to block
 * @returns {Promise} - Promise that resolves to updated user data
 */
export const blockUser = (userId) => {
  return apiClient.post(`/users/${userId}/block`);
};

/**
 * Unblock a specific user
 * @param {string} userId - User ID to unblock
 * @returns {Promise} - Promise that resolves to updated user data
 */
export const unblockUser = (userId) => {
  return apiClient.post(`/users/${userId}/unblock`);
};

/**
 * Get user token usage information
 * @param {string} userId - User ID
 * @returns {Promise} - Promise that resolves to user token usage data
 */
export const getUserTokenUsage = (userId) => {
  return apiClient.get(`/users/${userId}/token-usage`);
};

/**
 * Upload a document for the RAG system
 * @param {File} file - Document file
 * @param {Object} metadata - Document metadata
 * @returns {Promise} - Promise that resolves to upload confirmation
 */
export const uploadDocument = (file, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add metadata fields to formData
  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return apiClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Get all uploaded documents
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @returns {Promise} - Promise that resolves to documents data
 */
export const getDocuments = (page = 1, limit = 10) => {
  return apiClient.get(`/documents?page=${page}&limit=${limit}`);
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @returns {Promise} - Promise that resolves to deletion confirmation
 */
export const deleteDocument = (documentId) => {
  return apiClient.delete(`/documents/${documentId}`);
};

/**
 * Get system performance settings
 * @returns {Promise} - Promise that resolves to system performance settings
 */
export const getSystemSettings = () => {
  return apiClient.get('/system/settings');
};

/**
 * Update system performance settings
 * @param {Object} settings - Updated system settings
 * @returns {Promise} - Promise that resolves to updated system settings
 */
export const updateSystemSettings = (settings) => {
  return apiClient.put('/system/settings', settings);
};