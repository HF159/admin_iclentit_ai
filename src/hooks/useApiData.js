// src/hooks/useApiData.js
// Enhanced custom hook for API data fetching with additional features

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for fetching data from API endpoints with advanced features
 * @param {Function} fetchFunction - Function that returns a Promise (typically an API call)
 * @param {Array} dependencies - Array of dependencies that should trigger a refetch when changed
 * @param {Object} options - Additional options
 * @param {boolean} options.loadOnMount - Whether to load data on component mount (default: true)
 * @param {Object} options.initialData - Initial data state before fetch completes
 * @param {Function} options.onSuccess - Callback function to execute on successful fetch
 * @param {Function} options.onError - Callback function to execute on fetch error
 * @param {Function} options.transformData - Function to transform the response data
 * @param {number} options.retryCount - Number of times to retry on network failure (default: 0)
 * @param {number} options.retryDelay - Delay in ms between retries (default: 1000)
 * @returns {Object} - Object containing data, loading state, error, and refetch function
 */
const useApiData = (
  fetchFunction,
  dependencies = [],
  {
    loadOnMount = true,
    initialData = null,
    onSuccess = null,
    onError = null,
    transformData = data => data,
    retryCount = 0,
    retryDelay = 1000,
  } = {}
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(loadOnMount);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isMounted = useRef(true);
  const shouldLoadRef = useRef(loadOnMount);
  const retriesRef = useRef(0);

  // Function to handle the data fetching
  const fetchData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(params);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        const transformedData = transformData(result.data);
        setData(transformedData);
        setLastUpdated(new Date());
        retriesRef.current = 0; // Reset retry counter on success
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(transformedData);
        }
      }
      
      return result.data;
    } catch (err) {
      // Handle network errors with retry logic
      if (err.message === 'Network Error' && retriesRef.current < retryCount) {
        retriesRef.current += 1;
        console.log(`API call failed. Retrying (${retriesRef.current}/${retryCount})...`);
        
        // Retry after delay
        setTimeout(() => {
          if (isMounted.current) {
            fetchData(params);
          }
        }, retryDelay);
        
        return;
      }
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
        setError(errorMessage);
        
        // For network errors, set a more user-friendly message
        if (err.message === 'Network Error') {
          setError('Cannot connect to the server. Please check your connection or try again later.');
        }
        
        // Call onError callback if provided
        if (onError) {
          onError(err);
        }
      }
      
      throw err;
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction, transformData, onSuccess, onError, retryCount, retryDelay]);

  // Effect to fetch data on mount or when dependencies change
  useEffect(() => {
    // Skip initial fetch if loadOnMount is false
    if (!shouldLoadRef.current) {
      setLoading(false);
      shouldLoadRef.current = true; // Reset for future dependency changes
      return;
    }
    
    fetchData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Effect to handle cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

export default useApiData;