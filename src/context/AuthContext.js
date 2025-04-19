// src/context/AuthContext.js
// Authentication context for managing user authentication state

import React, { createContext, useReducer, useContext, useEffect } from 'react';
import apiClient from '../services/apiClient';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: Boolean(localStorage.getItem('token')),
  user: null,
  loading: false,
  error: null,
};

// Create context
const AuthContext = createContext(initialState);

// Action types
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const SET_USER = 'SET_USER';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if token exists on mount and load user data
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiClient.get('/me');
          dispatch({
            type: SET_USER,
            payload: response.data,
          });
        } catch (error) {
          // If error occurs, token might be invalid
          localStorage.removeItem('token');
          dispatch({ type: LOGOUT });
        }
      }
    };

    // Only load user if the token exists and no user is loaded yet
    if (state.isAuthenticated && !state.user) {
      loadUser();
    }
  }, [state.isAuthenticated, state.user]);

  // Actions
  const login = async (credentials) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      
      const response = await apiClient.post('/login', credentials);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.access_token);
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { 
          token: response.data.access_token,
          user: response.data.user
        },
      });
      
      return response.data;
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response?.data?.detail || 'Login failed. Please check your credentials.',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};