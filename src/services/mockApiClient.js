// src/services/mockApiClient.js
// Mock API client for development when backend is not available

import axios from 'axios';

// Create a mock adapter with delay to simulate network requests
const mockAxios = axios.create();

// Sample mock data
const mockData = {
  // Authentication
  login: {
    access_token: 'mock-jwt-token',
    token_type: 'bearer',
    user: {
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    }
  },
  
  // Analytics
  summary: {
    total_messages: 1248,
    unique_users: 156,
    feedback_rating: 87.5,
    token_usage: 128500,
    trend_messages: 'up',
    trend_messages_value: '12.5%',
    trend_users: 'up',
    trend_users_value: '8.3%',
    trend_rating: 'down',
    trend_rating_value: '2.1%',
    trend_tokens: 'up',
    trend_tokens_value: '15.8%'
  },
  
  dailyMessages: (range) => {
    const count = range === 'week' ? 7 : 30;
    return Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 100) + 50
      };
    });
  },
  
  dailyFeedback: {
    good: 78,
    bad: 22
  },
  
  userActivity: (range) => {
    const count = range === 'week' ? 7 : 30;
    return Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 30) + 10
      };
    });
  },
  
  tokenUsage: (range) => {
    const count = range === 'week' ? 7 : 30;
    return Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - i));
      return {
        date: date.toISOString().split('T')[0],
        input_tokens: Math.floor(Math.random() * 5000) + 2000,
        output_tokens: Math.floor(Math.random() * 8000) + 3000
      };
    });
  },
  
  ragPerformance: {
    relevance_score: 85,
    accuracy_score: 78,
    latency_score: 92,
    utilization_score: 65,
    success_rate: 88
  },
  
  topActions: [
    { action: 'Chat Query', count: 540 },
    { action: 'Document Search', count: 320 },
    { action: 'Knowledge Base', count: 280 },
    { action: 'Custom Request', count: 150 },
    { action: 'Feedback Submit', count: 90 }
  ],
  
  latestActivity: [
    { user_id: 'user_123', action: 'Chat Query', timestamp: '2025-04-14T09:23:45', status: 'Success' },
    { user_id: 'user_456', action: 'Document Upload', timestamp: '2025-04-14T09:15:22', status: 'Failed' },
    { user_id: 'user_789', action: 'Knowledge Query', timestamp: '2025-04-14T08:58:10', status: 'Success' },
    { user_id: 'user_234', action: 'Chat Query', timestamp: '2025-04-14T08:45:30', status: 'Success' },
    { user_id: 'user_567', action: 'Feedback Submit', timestamp: '2025-04-14T08:32:18', status: 'Success' },
  ],
  
  // Chat History
  chats: Array.from({ length: 25 }, (_, i) => ({
    _id: `chat_${i + 1}`,
    user_id: `user_${Math.floor(Math.random() * 10) + 1}`,
    messages: Array.from({ length: Math.floor(Math.random() * 8) + 2 }, (_, j) => ({
      role: j % 2 === 0 ? 'user' : 'assistant',
      content: `This is a ${j % 2 === 0 ? 'user' : 'assistant'} message for testing purposes.`,
      timestamp: new Date(Date.now() - (j * 60000)).toISOString()
    })),
    created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    last_active: new Date(Date.now() - (i * 1800000)).toISOString()
  })),
  
  // Feedback
  feedbacks: Array.from({ length: 30 }, (_, i) => ({
    id: `feedback_${i + 1}`,
    user_id: `user_${Math.floor(Math.random() * 10) + 1}`,
    message_content: `This is test feedback message ${i + 1} for testing purposes.`,
    sentiment: Math.random() > 0.3 ? 'good' : 'bad',
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
    notes: Math.random() > 0.5 ? [
      {
        content: 'This is an admin note on the feedback.',
        admin_id: 'admin',
        timestamp: new Date(Date.now() - (i * 1800000)).toISOString()
      }
    ] : []
  })),
  
  feedbackSentiment: {
    good: 78,
    bad: 22
  },
  
  feedbackPriority: {
    low: 45,
    medium: 35,
    high: 20
  },
  
  // Token Settings
  tokenSettings: {
    daily_token_limit: 10000,
    last_updated: new Date().toISOString()
  },
  
  // Limited Users
  limitedUsers: Array.from({ length: 15 }, (_, i) => ({
    user_id: `user_${i + 1}`,
    is_limited: Math.random() > 0.7,
    is_blocked: Math.random() > 0.8,
    usage: {
      total_tokens: Math.floor(Math.random() * 50000) + 5000
    }
  })),
  
  userTokenUsage: {
    total_tokens: 42500,
    today_tokens: 1250,
    last_active: new Date().toISOString(),
    history: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        tokens: Math.floor(Math.random() * 2000) + 500
      };
    })
  },
  
  // Documents
  documents: Array.from({ length: 8 }, (_, i) => ({
    id: `doc_${i + 1}`,
    filename: `document_${i + 1}.${['pdf', 'txt', 'docx', 'csv'][Math.floor(Math.random() * 4)]}`,
    description: `Test document ${i + 1} description`,
    category: ['general', 'product', 'technical', 'support'][Math.floor(Math.random() * 4)],
    uploaded_at: new Date(Date.now() - (i * 86400000)).toISOString()
  })),
  
  // FAQ Content
  faqContent: {
    content: [
      {
        category: 'General',
        items: [
          {
            question: 'What is this AI system?',
            answer: 'This is a comprehensive AI system that provides intelligent responses to user queries.'
          },
          {
            question: 'How do I get started?',
            answer: 'You can get started by creating an account and asking your first question.'
          }
        ]
      },
      {
        category: 'Technical',
        items: [
          {
            question: 'What technologies are used?',
            answer: 'The system uses natural language processing and machine learning algorithms.'
          },
          {
            question: 'Is my data secure?',
            answer: 'Yes, all data is encrypted and stored securely following industry best practices.'
          }
        ]
      }
    ]
  },
  
  faqLanguages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ]
};

// Intercept all requests and return mock data
mockAxios.interceptors.request.use(
  async (config) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300); // Add a small delay to simulate network request
    
    // Parse the URL to determine what data to return
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    
    let response = { status: 200, data: null };
    
    // Login endpoint
    if (url === '/login' && method === 'post') {
      response.data = mockData.login;
    }
    
    // Analytics endpoints
    else if (url.includes('/analytics/summary')) {
      response.data = mockData.summary;
    }
    else if (url.includes('/analytics/daily/messages')) {
      const range = url.includes('range=month') ? 'month' : 'week';
      response.data = mockData.dailyMessages(range);
    }
    else if (url.includes('/analytics/daily/feedback')) {
      response.data = mockData.dailyFeedback;
    }
    else if (url.includes('/analytics/user-activity')) {
      const range = url.includes('range=month') ? 'month' : 'week';
      response.data = mockData.userActivity(range);
    }
    else if (url.includes('/analytics/token-usage')) {
      const range = url.includes('range=month') ? 'month' : 'week';
      response.data = mockData.tokenUsage(range);
    }
    else if (url.includes('/analytics/rag-performance')) {
      response.data = mockData.ragPerformance;
    }
    
    // Chat History endpoints
    else if (url.includes('/chats') && !url.includes('/export') && method === 'get') {
      try {
        const queryString = url.includes('?') ? url.split('?')[1] : '';
        const params = new URLSearchParams(queryString);
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const start = (page - 1) * limit;
        const end = start + limit;
        
        response.data = {
          chats: mockData.chats.slice(start, end),
          page,
          limit,
          totalItems: mockData.chats.length,
          totalPages: Math.ceil(mockData.chats.length / limit)
        };
      } catch (err) {
        console.error('Error parsing chat URL params:', err);
        response.data = {
          chats: mockData.chats.slice(0, 10),
          page: 1,
          limit: 10,
          totalItems: mockData.chats.length,
          totalPages: Math.ceil(mockData.chats.length / 10)
        };
      }
    }
    else if (url.match(/\/chats\/[^/]+$/) && method === 'get') {
      const chatId = url.split('/').pop();
      const chat = mockData.chats.find(c => c._id === chatId);
      if (chat) {
        response.data = chat;
      } else {
        response = { status: 404, data: { detail: 'Chat not found' } };
      }
    }
    else if (url.match(/\/chats\/[^/]+$/) && method === 'delete') {
      response.data = { success: true, message: 'Chat deleted successfully' };
    }
    
    // Feedback endpoints
    else if (url.includes('/feedbacks') && !url.includes('/export') && method === 'get') {
      try {
        const queryString = url.includes('?') ? url.split('?')[1] : '';
        const params = new URLSearchParams(queryString);
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const start = (page - 1) * limit;
        const end = start + limit;
        
        response.data = {
          feedbacks: mockData.feedbacks.slice(start, end),
          page,
          limit,
          totalItems: mockData.feedbacks.length,
          totalPages: Math.ceil(mockData.feedbacks.length / limit)
        };
      } catch (err) {
        console.error('Error parsing feedback URL params:', err);
        response.data = {
          feedbacks: mockData.feedbacks.slice(0, 10),
          page: 1,
          limit: 10,
          totalItems: mockData.feedbacks.length,
          totalPages: Math.ceil(mockData.feedbacks.length / 10)
        };
      }
    }
    else if (url.includes('/feedbacks/sentiment')) {
      response.data = mockData.feedbackSentiment;
    }
    else if (url.includes('/feedbacks/priority')) {
      response.data = mockData.feedbackPriority;
    }
    else if (url.match(/\/feedbacks\/[^/]+\/priority$/) && method === 'patch') {
      response.data = { success: true, message: 'Priority updated successfully' };
    }
    else if (url.match(/\/feedbacks\/[^/]+\/notes$/) && method === 'post') {
      response.data = { success: true, message: 'Note added successfully' };
    }
    
    // Token Settings endpoints
    else if (url === '/tokens/settings' && method === 'get') {
      response.data = mockData.tokenSettings;
    }
    else if (url === '/tokens/settings' && method === 'put') {
      response.data = { ...mockData.tokenSettings, ...config.data, last_updated: new Date().toISOString() };
    }
    
    // User Management endpoints
    else if (url.includes('/users/limited') && method === 'get') {
      try {
        const queryString = url.includes('?') ? url.split('?')[1] : '';
        const params = new URLSearchParams(queryString);
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const start = (page - 1) * limit;
        const end = start + limit;
        
        response.data = {
          users: mockData.limitedUsers.slice(start, end),
          count: mockData.limitedUsers.length
        };
      } catch (err) {
        console.error('Error parsing users URL params:', err);
        response.data = {
          users: mockData.limitedUsers.slice(0, 10),
          count: mockData.limitedUsers.length
        };
      }
    }
    else if (url.match(/\/users\/[^/]+\/block$/) && method === 'post') {
      response.data = { success: true, message: 'User blocked successfully' };
    }
    else if (url.match(/\/users\/[^/]+\/unblock$/) && method === 'post') {
      response.data = { success: true, message: 'User unblocked successfully' };
    }
    else if (url.match(/\/users\/[^/]+\/token-usage$/) && method === 'get') {
      response.data = mockData.userTokenUsage;
    }
    
    // Document Management endpoints
    else if (url === '/documents' && method === 'get') {
      response.data = {
        documents: mockData.documents,
        count: mockData.documents.length
      };
    }
    else if (url === '/documents/upload' && method === 'post') {
      response.data = { success: true, message: 'Document uploaded successfully' };
    }
    else if (url.match(/\/documents\/[^/]+$/) && method === 'delete') {
      response.data = { success: true, message: 'Document deleted successfully' };
    }
    
    // FAQ Management endpoints
    else if (url.match(/\/admin\/faq\/[^/]+$/) && method === 'get') {
      response.data = mockData.faqContent;
    }
    else if (url.match(/\/admin\/faq\/[^/]+$/) && method === 'put') {
      response.data = { success: true, message: 'FAQ content updated successfully' };
    }
    else if (url === '/admin/faq/languages' && method === 'get') {
      response.data = mockData.faqLanguages;
    }
    else if (url === '/me' && method === 'get') {
      response.data = mockData.login.user;
    }
    else if (url === '/health-check' && method === 'get') {
        response.data = { status: 'ok', message: 'Mock API is running' };
    }
    
    // Handle unknown endpoints
    else {
      console.warn(`No mock data for: ${method.toUpperCase()} ${url}`);
      response = {
        status: 404,
        data: { detail: 'Endpoint not found in mock API' }
      };
    }
    
    // Create a mock axios response
    return Promise.resolve({
      data: response.data,
      status: response.status,
      statusText: response.status === 200 ? 'OK' : 'Error',
      headers: {},
      config
    });
  },
  error => {
    return Promise.reject(error);
  }
);

export default mockAxios;