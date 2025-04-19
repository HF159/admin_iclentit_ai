// src/services/apiClient.js
import axios from 'axios';

// Environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8013/';
const USE_MOCK_API = false ;

console.log(`Using ${USE_MOCK_API ? 'MOCK' : 'REAL'} API client`);

// Create a real API client
const realApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors to real client
realApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

realApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create mock API client that returns mock data
const mockApiClient = {
  get: async (url) => {
    console.log(`MOCK API GET: ${url}`);
    
    // Generate mock data based on requested URL
    // This is where you'd implement your mock data logic
    let mockData = getMockDataForUrl(url);
    
    // Return mock response in the same format as axios
    return {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  },
  
  post: async (url, data) => {
    console.log(`MOCK API POST: ${url}`, data);
    
    // Handle the post and generate appropriate response
    let mockResponse = getMockResponseForPost(url, data);
    
    return {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  },
  
  put: async (url, data) => {
    console.log(`MOCK API PUT: ${url}`, data);
    
    // Handle the put and generate appropriate response
    let mockResponse = getMockResponseForPut(url, data);
    
    return {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  },
  
  delete: async (url) => {
    console.log(`MOCK API DELETE: ${url}`);
    
    // Handle the delete and generate appropriate response
    let mockResponse = getMockResponseForDelete(url);
    
    return {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  }
};

// Mock data generation helper functions
function getMockDataForUrl(url) {
  // Parse the URL to determine what data to return
  if (url.includes('/analytics/daily/messages')) {
    return {
      success: true,
      message: "Daily message statistics retrieved successfully",
      data: {
        period: "daily",
        start_date: "2025-04-14T00:00:00.000Z",
        end_date: "2025-04-14T23:59:59.999Z",
        total_count: 150,
        unique_users: 25,
        average_messages_per_user: 6.0
      },
      timestamp: new Date().toISOString()
    };
  }
  
  if (url.includes('/analytics/daily/feedback')) {
    return {
      success: true,
      message: "Daily feedback statistics retrieved successfully",
      data: {
        period: "daily",
        start_date: "2025-04-14T00:00:00.000Z",
        end_date: "2025-04-14T23:59:59.999Z",
        total_count: 15,
        sentiment_breakdown: {
          good: 10,
          bad: 5
        },
        priority_breakdown: {
          low: 2,
          medium: 8,
          high: 5
        }
      },
      timestamp: new Date().toISOString()
    };
  }
  
  if (url.includes('/analytics/monthly/messages')) {
    return {
      success: true,
      message: "Monthly message statistics retrieved successfully",
      data: {
        period: "monthly",
        start_date: "2025-04-01T00:00:00.000Z",
        end_date: "2025-04-30T23:59:59.999Z",
        year: 2025,
        month: 4,
        total_count: 4500,
        unique_users: 120,
        average_messages_per_user: 37.5
      },
      timestamp: new Date().toISOString()
    };
  }
  
  if (url.includes('/analytics/user-activity')) {
    return {
      success: true,
      message: "User activity retrieved successfully",
      data: [
        { date: "2025-04-08", count: 42 },
        { date: "2025-04-09", count: 38 },
        { date: "2025-04-10", count: 56 },
        { date: "2025-04-11", count: 61 },
        { date: "2025-04-12", count: 45 },
        { date: "2025-04-13", count: 32 },
        { date: "2025-04-14", count: 50 }
      ],
      timestamp: new Date().toISOString()
    };
  }
  
  if (url.includes('/analytics/token-usage')) {
    return {
      success: true,
      message: "Token usage retrieved successfully",
      data: [
        { date: "2025-04-08", input_tokens: 5200, output_tokens: 8400 },
        { date: "2025-04-09", input_tokens: 4800, output_tokens: 7900 },
        { date: "2025-04-10", input_tokens: 6300, output_tokens: 9500 },
        { date: "2025-04-11", input_tokens: 6800, output_tokens: 10200 },
        { date: "2025-04-12", input_tokens: 5500, output_tokens: 8800 },
        { date: "2025-04-13", input_tokens: 4200, output_tokens: 7100 },
        { date: "2025-04-14", input_tokens: 5800, output_tokens: 9300 }
      ],
      timestamp: new Date().toISOString()
    };
  }
  
  if (url.includes('/analytics/rag-performance')) {
    return {
      success: true,
      message: "RAG performance metrics retrieved successfully",
      data: {
        relevance_score: 85,
        accuracy_score: 78,
        latency_score: 92,
        utilization_score: 65,
        success_rate: 88
      },
      timestamp: new Date().toISOString()
    };
  }
  
  // Default mock data for unknown endpoints
  return {
    success: false,
    message: `No mock data available for ${url}`,
    timestamp: new Date().toISOString()
  };
}

function getMockResponseForPost(url, data) {
  // Handle different POST endpoints
  // Example for posting a message
  if (url.includes('/message')) {
    return {
      success: true,
      message: "Message sent successfully",
      data: {
        content: "This is a mock response to your message",
        role: "assistant",
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // Default response
  return {
    success: true,
    message: "Operation completed successfully",
    timestamp: new Date().toISOString()
  };
}

function getMockResponseForPut(url, data) {
  // Handle different PUT endpoints
  // Example for updating token settings
  if (url.includes('/tokens/settings')) {
    return {
      success: true,
      message: `Token limit updated to ${data.daily_token_limit}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Default response
  return {
    success: true,
    message: "Update completed successfully",
    timestamp: new Date().toISOString()
  };
}

function getMockResponseForDelete(url) {
  // Handle different DELETE endpoints
  // Example for deleting chat history
  if (url.includes('/history/')) {
    return {
      success: true,
      message: "Chat history cleared successfully",
      timestamp: new Date().toISOString()
    };
  }
  
  // Default response
  return {
    success: true,
    message: "Delete operation completed successfully",
    timestamp: new Date().toISOString()
  };
}

// Export the appropriate client based on configuration
const apiClient = USE_MOCK_API ? mockApiClient : realApiClient;

export default apiClient;