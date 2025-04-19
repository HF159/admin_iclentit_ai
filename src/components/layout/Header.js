// src/components/layout/Header.js
// Header component for main content area

import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();
  
  return (
    <header className="main-header">
      <h1>{title}</h1>
      <div className="user-info">
        <span className="username">{user?.username || 'Admin'}</span>
      </div>
    </header>
  );
};

export default Header;