// src/utils/backendCheck.js
// Utility to check if the backend is available

import axios from 'axios';

/**
 * Checks if the backend API is available
 * @param {string} url - The backend URL to check
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if backend is available
 */
export const checkBackendAvailability = async (url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8013', timeout = 5000) => {
  try {
    // Create a cancel token with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Try to reach a simple endpoint
    await axios.get(`${url}`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log('✅ Backend is available');
    return true;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      console.warn('⚠️ Backend connection timed out');
    } else if (error.response) {
      // Any response means the backend is running, even if it's an error
      console.log('✅ Backend is available (response status:', error.response.status, ')');
      return true;
    } else {
      console.warn('❌ Backend is not available:', error.message);
    }
    return false;
  }
};

/**
 * Runs the backend availability check on app startup
 */
export const runBackendCheck = () => {
  checkBackendAvailability()
    .then(isAvailable => {
      if (!isAvailable && process.env.REACT_APP_USE_MOCK_API !== 'true') {
        console.warn('⚠️ Backend is not available but mock API is disabled. You may encounter errors.');
      }
    })
    .catch(error => {
      console.error('Error running backend check:', error);
    });
};

export default {
  checkBackendAvailability,
  runBackendCheck
};