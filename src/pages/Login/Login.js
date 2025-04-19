// src/pages/Login/Login.js
// Login page component with form validation

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  // Form state
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  
  // Form validation state
  const [validation, setValidation] = useState({
    username: '',
    password: '',
  });
  
  // Authentication context
  const { 
    login, 
    loading, 
    error, 
    isAuthenticated 
  } = useAuth();
  
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update credentials
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validation[name]) {
      setValidation(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newValidation = { username: '', password: '' };
    
    // Username validation
    if (!credentials.username.trim()) {
      newValidation.username = 'Username is required';
      isValid = false;
    }
    
    // Password validation
    if (!credentials.password) {
      newValidation.password = 'Password is required';
      isValid = false;
    } else if (credentials.password.length < 6) {
      newValidation.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setValidation(newValidation);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (validateForm()) {
      await login(credentials);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-header">
            <h1>AI Admin Panel</h1>
            <p>Sign in to manage your AI system</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className={validation.username ? 'error' : ''}
                placeholder="Enter your username"
                disabled={loading}
              />
              {validation.username && (
                <div className="input-error">{validation.username}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={validation.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={loading}
              />
              {validation.password && (
                <div className="input-error">{validation.password}</div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner-icon"></span>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>© {new Date().getFullYear()} AI Admin Panel</p>
            <p>Need help? Contact your system administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;