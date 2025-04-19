import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import Dashboard from './pages/Dashboard/Dashboard';
import ChatHistory from './pages/ChatHistory/ChatHistory';
import Feedback from './pages/Feedback/Feedback';
import Settings from './pages/Settings/Settings';
import FaqEditor from './pages/FaqEditor/FaqEditor';

// Debug logging
console.log('DEBUG: App component loaded');

function App() {
  useEffect(() => {
    console.log('DEBUG: App component mounted');
    
    // Add a visible element to see if rendering works
    const debugElement = document.createElement('div');
    debugElement.style.padding = '20px';
    debugElement.style.background = 'red';
    debugElement.style.color = 'white';
    debugElement.style.position = 'fixed';
    debugElement.style.top = '0';
    debugElement.style.left = '0';
    debugElement.style.zIndex = '9999';
    debugElement.textContent = 'App is loading...';
    document.body.appendChild(debugElement);
    
    return () => {
      if (document.body.contains(debugElement)) {
        document.body.removeChild(debugElement);
      }
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat-history" element={<ChatHistory />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/faq-editor" element={<FaqEditor />} />
      </Routes>
    </Router>
  );
}

export default App;