// src/components/layout/Sidebar.js
// Sidebar navigation component

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>AI Admin</h2>
      </div>
      
      <nav className="nav-menu">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat-history" className={({ isActive }) => isActive ? 'active' : ''}>
              Chat History
            </NavLink>
          </li>
          <li>
            <NavLink to="/feedback" className={({ isActive }) => isActive ? 'active' : ''}>
              Feedback
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;