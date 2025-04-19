// src/services/feedback.js
// Enhanced service for feedback-related API calls

import apiClient from './apiClient';

/**
 * Get all feedback entries with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {Object} filters - Optional filters (user_id, sentiment, priority, date_from, date_to)
 * @returns {Promise} - Promise that resolves to feedback entries
 */
export const getAllFeedback = (page = 1, limit = 10, filters = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  }).toString();
  
  return apiClient.get(`/feedbacks?${queryParams}`);
};

/**
 * Get a specific feedback entry by ID
 * @param {string} feedbackId - Feedback entry ID
 * @returns {Promise} - Promise that resolves to feedback entry data
 */
export const getFeedbackById = (feedbackId) => {
  return apiClient.get(`/feedbacks/${feedbackId}`);
};

/**
 * Update the priority of a feedback entry
 * @param {string} feedbackId - Feedback entry ID
 * @param {string} priority - New priority level ('low', 'medium', 'high')
 * @returns {Promise} - Promise that resolves to updated feedback entry
 */
export const updateFeedbackPriority = (feedbackId, priority) => {
  return apiClient.patch(`/feedbacks/${feedbackId}/priority`, { priority });
};

/**
 * Add an admin note to a feedback entry
 * @param {string} feedbackId - Feedback entry ID
 * @param {string} note - Admin note text
 * @returns {Promise} - Promise that resolves to updated feedback entry
 */
export const addFeedbackNote = (feedbackId, note) => {
  return apiClient.post(`/feedbacks/${feedbackId}/notes`, { note });
};

/**
 * Get feedback sentiment distribution with flexible time ranges
 * @param {string} range - Time range to analyze (default: "week")
 * @param {string} startDate - Optional custom start date (ISO format)
 * @param {string} endDate - Optional custom end date (ISO format)
 * @param {boolean} comparePrevious - Whether to include previous period data for comparison
 * @returns {Promise} - Promise that resolves to sentiment distribution data
 */
export const getFeedbackSentiment = (range = "week", startDate = null, endDate = null, comparePrevious = false) => {
  const params = { range, compare_previous: comparePrevious };
  
  if (range === "custom" && startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  
  return apiClient.get('/feedbacks/analytics/sentiment', { params });
};

/**
 * Get feedback priority distribution with flexible time ranges
 * @param {string} range - Time range to analyze (default: "week")
 * @param {string} startDate - Optional custom start date (ISO format)
 * @param {string} endDate - Optional custom end date (ISO format)
 * @param {boolean} comparePrevious - Whether to include previous period data for comparison
 * @returns {Promise} - Promise that resolves to priority distribution data
 */
export const getFeedbackPriority = (range = "week", startDate = null, endDate = null, comparePrevious = false) => {
  const params = { range, compare_previous: comparePrevious };
  
  if (range === "custom" && startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  
  return apiClient.get('/feedbacks/analytics/priority', { params });
};

/**
 * Get feedback sentiment trends over time
 * @param {string} timespan - Period to analyze (default: "month")
 * @param {string} period - Granularity of data points (default: "daily")
 * @param {string} startDate - Optional custom start date (ISO format)
 * @param {string} endDate - Optional custom end date (ISO format)
 * @returns {Promise} - Promise that resolves to sentiment trend data
 */
export const getSentimentTrends = (timespan = "month", period = "daily", startDate = null, endDate = null) => {
  const params = { timespan, period };
  
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  
  return apiClient.get('/feedbacks/trends/sentiment', { params });
};

/**
 * Get feedback priority trends over time
 * @param {string} timespan - Period to analyze (default: "month")
 * @param {string} period - Granularity of data points (default: "daily")
 * @param {string} startDate - Optional custom start date (ISO format)
 * @param {string} endDate - Optional custom end date (ISO format)
 * @returns {Promise} - Promise that resolves to priority trend data
 */
export const getPriorityTrends = (timespan = "month", period = "daily", startDate = null, endDate = null) => {
  const params = { timespan, period };
  
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  
  return apiClient.get('/feedbacks/trends/priority', { params });
};

/**
 * Get comprehensive feedback dashboard data
 * @param {number} days - Number of days to include in the dashboard (default: 30)
 * @param {boolean} comparePrevious - Whether to include comparison with previous period
 * @returns {Promise} - Promise that resolves to dashboard data
 */
export const getFeedbackDashboard = (days = 30, comparePrevious = true) => {
  return apiClient.get('/feedbacks/dashboard', { 
    params: { 
      days, 
      compare_previous: comparePrevious 
    } 
  });
};

/**
 * Export feedback data
 * @param {string} format - Export format ('csv' or 'json')
 * @param {Object} filters - Optional filters (user_id, sentiment, priority, date_from, date_to)
 * @returns {Promise} - Promise that resolves to export data
 */
export const exportFeedback = (format = 'csv', filters = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams({
    format,
    ...filters
  }).toString();
  
  return apiClient.get(`/feedbacks/export?${queryParams}`, {
    responseType: 'blob'  // Important for handling file downloads
  });
};