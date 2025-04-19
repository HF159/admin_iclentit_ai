// src/services/chat.js
// Service for chat history-related API calls

import apiClient from './apiClient';

/**
 * Get all chat sessions with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {Object} filters - Optional filters (user_id, date_from, date_to)
 * @returns {Promise} - Promise that resolves to chat sessions data
 */
export const getAllChats = (page = 1, limit = 10, filters = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  }).toString();
  
  return apiClient.get(`/chats?${queryParams}`);
};

/**
 * Get chat history for a specific user
 * @param {string} userId - User ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {Object} filters - Optional filters (date_from, date_to)
 * @returns {Promise} - Promise that resolves to user's chat history
 */
export const getUserChatHistory = (userId, page = 1, limit = 10, filters = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  }).toString();
  
  return apiClient.get(`/history/${userId}?${queryParams}`);
};

/**
 * Get a specific chat session by ID
 * @param {string} chatId - Chat session ID
 * @returns {Promise} - Promise that resolves to chat session data
 */
export const getChatById = (chatId) => {
  return apiClient.get(`/chats/${chatId}`);
};

/**
 * Delete a specific chat session
 * @param {string} chatId - Chat session ID
 * @returns {Promise} - Promise that resolves to deletion confirmation
 */
export const deleteChat = (chatId) => {
  return apiClient.delete(`/chats/${chatId}`);
};

/**
 * Export chat history data
 * @param {string} format - Export format ('csv' or 'json')
 * @param {Object} filters - Optional filters (user_id, date_from, date_to)
 * @returns {Promise} - Promise that resolves to export data
 */
export const exportChatHistory = (format = 'csv', filters = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams({
    format,
    ...filters
  }).toString();
  
  return apiClient.get(`/chats/export?${queryParams}`, {
    responseType: 'blob'  // Important for handling file downloads
  });
};