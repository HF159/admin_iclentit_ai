import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import page components
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ChatHistory from './pages/ChatHistory/ChatHistory';
import Feedback from './pages/Feedback/Feedback';
import Settings from './pages/Settings/Settings';
import FaqEditor from './pages/FaqEditor/FaqEditor';

// Environment config
const DEV_MODE = process.env.NODE_ENV === 'development';
const SKIP_AUTH = DEV_MODE && process.env.REACT_APP_SKIP_AUTH === 'true';

// Protected route component
const ProtectedRoute = ({ children }) => {
  // Always call the hook, regardless of whether we're in dev mode
  const { isAuthenticated, loading } = useAuth();
  
  // Skip auth check in development mode if enabled
  if (SKIP_AUTH) {
    console.log('DEV MODE: Authentication check bypassed');
    return children;
  }
  
  // Show loading indicator while checking auth
  if (loading) {
    return <div className="loading-auth">Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chat-history" element={
          <ProtectedRoute>
            <ChatHistory />
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/faq-editor" element={
          <ProtectedRoute>
            <FaqEditor />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Wrap App with AuthProvider
export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}