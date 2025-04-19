// src/services/analytics.js
// Service for analytics-related API calls

import apiClient from './apiClient';

/**
 * Get daily message statistics for a specified date
 * @param {string} date - Optional target date (YYYY-MM-DD)
 * @returns {Promise} - Promise that resolves to daily message data
 */
export const getDailyMessages = (date) => {
  const params = date ? { date } : {};
  return apiClient.get('/analytics/daily/messages', { params });
};

/**
 * Get daily feedback statistics for a specified date
 * @param {string} date - Optional target date (YYYY-MM-DD)
 * @param {string} sentiment - Optional filter by sentiment
 * @param {string} priority - Optional filter by priority
 * @returns {Promise} - Promise that resolves to daily feedback data
 */
export const getDailyFeedback = (date, sentiment, priority) => {
  const params = {};
  if (date) params.date = date;
  if (sentiment) params.sentiment = sentiment;
  if (priority) params.priority = priority;
  
  return apiClient.get('/analytics/daily/feedback', { params });
};

/**
 * Get monthly message statistics
 * @param {number} year - Target year
 * @param {number} month - Target month (1-12)
 * @returns {Promise} - Promise that resolves to monthly message data
 */
export const getMonthlyMessages = (year, month) => {
  // If year and month aren't provided, use current date
  if (!year || !month) {
    const now = new Date();
    year = year || now.getFullYear();
    month = month || now.getMonth() + 1;
  }
  
  return apiClient.get('/analytics/monthly/messages', { 
    params: { year, month } 
  });
};

/**
 * Get monthly feedback statistics
 * @param {number} year - Target year
 * @param {number} month - Target month (1-12)
 * @param {string} sentiment - Optional filter by sentiment
 * @param {string} priority - Optional filter by priority
 * @returns {Promise} - Promise that resolves to monthly feedback data
 */
export const getMonthlyFeedback = (year, month, sentiment, priority) => {
  // If year and month aren't provided, use current date
  if (!year || !month) {
    const now = new Date();
    year = year || now.getFullYear();
    month = month || now.getMonth() + 1;
  }
  
  const params = { year, month };
  if (sentiment) params.sentiment = sentiment;
  if (priority) params.priority = priority;
  
  return apiClient.get('/analytics/monthly/feedback', { params });
};

// Mock implementations for endpoints that don't exist on the backend
// These return realistic mock data instead of making actual API calls

/**
 * Get summary metrics (mocked)
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock summary metrics
 */
export const getSummaryMetrics = (range = 'week') => {
  console.log('Using mocked getSummaryMetrics');
  return Promise.resolve({
    data: {
      success: true,
      message: "Summary metrics retrieved successfully",
      data: {
        total_messages: range === 'week' ? 850 : 3500,
        unique_users: range === 'week' ? 120 : 450,
        average_rating: 4.2,
        total_feedback: range === 'week' ? 68 : 280,
        positive_feedback_percentage: 78
      },
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get user activity metrics (mocked)
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock user activity data
 */
export const getUserActivity = (range = 'week') => {
  console.log('Using mocked getUserActivity');
  const days = range === 'week' ? 7 : 30;
  const mockData = [];
  
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 20
    });
  }
  
  return Promise.resolve({
    data: {
      success: true,
      message: "User activity retrieved successfully",
      data: mockData,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get token usage statistics (mocked)
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock token usage data
 */
export const getTokenUsage = (range = 'week') => {
  console.log('Using mocked getTokenUsage');
  const days = range === 'week' ? 7 : 30;
  const mockData = [];
  
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const inputTokens = Math.floor(Math.random() * 2000) + 3000;
    mockData.push({
      date: date.toISOString().split('T')[0],
      input_tokens: inputTokens,
      output_tokens: Math.floor(inputTokens * 1.5)
    });
  }
  
  return Promise.resolve({
    data: {
      success: true,
      message: "Token usage retrieved successfully",
      data: mockData,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get RAG system performance metrics (mocked)
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock RAG performance data
 */
export const getRagPerformance = (range = 'week') => {
  console.log('Using mocked getRagPerformance');
  return Promise.resolve({
    data: {
      success: true,
      message: "RAG performance metrics retrieved successfully",
      data: {
        relevance_score: Math.floor(Math.random() * 15) + 75,
        accuracy_score: Math.floor(Math.random() * 15) + 75,
        latency_score: Math.floor(Math.random() * 15) + 75,
        utilization_score: Math.floor(Math.random() * 15) + 65,
        success_rate: Math.floor(Math.random() * 10) + 85
      },
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get message categories (mocked)
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock category distribution data
 */
export const getMessageCategories = (range = 'week') => {
  console.log('Using mocked getMessageCategories');
  return Promise.resolve({
    data: {
      success: true,
      message: "Message categories retrieved successfully",
      data: [
        { category: "General Information", count: 45 },
        { category: "Booking", count: 32 },
        { category: "Payment", count: 18 },
        { category: "Technical Support", count: 25 },
        { category: "Feedback", count: 12 },
        { category: "Other", count: 8 }
      ],
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get hourly distribution (mocked)
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock hourly distribution data
 */
export const getHourlyDistribution = (range = 'week') => {
  console.log('Using mocked getHourlyDistribution');
  const mockData = [];
  
  for (let hour = 0; hour < 24; hour++) {
    mockData.push({
      hour: hour,
      count: Math.floor(Math.random() * 50) + (hour >= 8 && hour <= 20 ? 30 : 5)
    });
  }
  
  return Promise.resolve({
    data: {
      success: true,
      message: "Hourly distribution retrieved successfully",
      data: mockData,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get top users (mocked)
 * @param {number} limit - Number of users to retrieve
 * @param {string} range - Time range
 * @returns {Promise} - Promise that resolves to mock top users data
 */
export const getTopUsers = (limit = 10, range = 'week') => {
  console.log('Using mocked getTopUsers');
  const mockData = [];
  
  for (let i = 0; i < limit; i++) {
    mockData.push({
      user_id: `user_${i + 1}`,
      message_count: Math.floor(Math.random() * 50) + 20,
      average_tokens: Math.floor(Math.random() * 300) + 100
    });
  }
  
  return Promise.resolve({
    data: {
      success: true,
      message: "Top users retrieved successfully",
      data: mockData,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Get comparison metrics (mocked)
 * @param {string} currentRange - Current time range
 * @param {string} previousRange - Previous time range for comparison
 * @returns {Promise} - Promise that resolves to mock comparison data
 */
export const getComparisonMetrics = (currentRange = 'week', previousRange = 'week') => {
  console.log('Using mocked getComparisonMetrics');
  return Promise.resolve({
    data: {
      success: true,
      message: "Comparison metrics retrieved successfully",
      data: {
        messages: {
          current: 850,
          previous: 780,
          percentage_change: 8.97
        },
        users: {
          current: 120,
          previous: 105,
          percentage_change: 14.29
        },
        feedback: {
          current: 68,
          previous: 62,
          percentage_change: 9.68
        },
        positive_sentiment: {
          current: 78,
          previous: 72,
          percentage_change: 8.33
        }
      },
      timestamp: new Date().toISOString()
    }
  });
};