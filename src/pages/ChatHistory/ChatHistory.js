// src/pages/ChatHistory/ChatHistory.js
// Chat history page component

import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import useApiData from '../../hooks/useApiData';
import * as chatService from '../../services/chat';
import './ChatHistory.css';

// ChatHistoryFilter component for filtering chat history
const ChatHistoryFilter = ({ onFilterChange, filters, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      user_id: '',
      date_from: '',
      date_to: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="chat-history-filter">
      <h3>Filter Chats</h3>
      <form onSubmit={handleSubmit}>
        <div className="filter-group">
          <label htmlFor="user_id">User ID:</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={localFilters.user_id || ''}
            onChange={handleInputChange}
            placeholder="Enter user ID"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="date_from">Date From:</label>
          <input
            type="date"
            id="date_from"
            name="date_from"
            value={localFilters.date_from || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="date_to">Date To:</label>
          <input
            type="date"
            id="date_to"
            name="date_to"
            value={localFilters.date_to || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="filter-actions">
          <button type="submit" disabled={loading}>Apply Filters</button>
          <button type="button" onClick={handleClear} disabled={loading}>Clear</button>
        </div>
      </form>
    </div>
  );
};

// ChatMessage component for rendering individual messages
const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-header">
        <span className="message-role">{message.role}</span>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

// ChatSession component for rendering a chat session with expandable messages
const ChatSession = ({ chat, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      onDelete(chat._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="chat-session">
      <div className="chat-session-header" onClick={toggleExpand}>
        <div className="chat-session-info">
          <span className="user-id">User ID: {chat.user_id}</span>
          <span className="chat-date">
            Created: {formatDate(chat.created_at)}
          </span>
          <span className="chat-date">
            Last Active: {formatDate(chat.last_active)}
          </span>
        </div>
        <div className="chat-session-actions">
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="chat-messages">
          {chat.messages.length > 0 ? (
            chat.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          ) : (
            <div className="no-messages">No messages in this chat session.</div>
          )}
        </div>
      )}
    </div>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button 
        onClick={handlePrevious} 
        disabled={currentPage === 1 || loading}
        className="pagination-btn"
      >
        Previous
      </button>
      <span className="page-info">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button 
        onClick={handleNext} 
        disabled={currentPage >= totalPages || loading}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
};

// Main ChatHistory component
const ChatHistory = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    user_id: '',
    date_from: '',
    date_to: ''
  });
  
  // Custom hook to fetch chat data
  const { 
    data: chatData, 
    loading, 
    error, 
    refetch 
  } = useApiData(
    () => chatService.getAllChats(page, limit, filters),
    [page, limit, filters]
  );

  // Handle deleting a chat session
  const handleDeleteChat = async (chatId) => {
    try {
      await chatService.deleteChat(chatId);
      // Refetch data after successful deletion
      refetch();
    } catch (err) {
      console.error('Error deleting chat:', err);
      // You could add a notification system here
      alert('Failed to delete chat session. Please try again.');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Handle exporting chat history
  const handleExport = async (format) => {
    try {
      const response = await chatService.exportChatHistory(format, filters);
      
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chat-history-export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting chat history:', err);
      alert('Failed to export chat history. Please try again.');
    }
  };
  
  // Calculate total pages based on the total count from the API
  const totalPages = chatData?.totalPages || 1;

  return (
    <div className="chat-history-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Chat History" />
        
        <div className="chat-history-controls">
          <ChatHistoryFilter 
            onFilterChange={handleFilterChange} 
            filters={filters} 
            loading={loading}
          />
          
          <div className="export-controls">
            <h3>Export Data</h3>
            <div className="export-buttons">
              <button 
                onClick={() => handleExport('csv')} 
                disabled={loading || !chatData?.chats?.length}
                className="export-btn"
              >
                Export as CSV
              </button>
              <button 
                onClick={() => handleExport('json')} 
                disabled={loading || !chatData?.chats?.length}
                className="export-btn"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            Error loading chat history: {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading">Loading chat history...</div>
        ) : (
          <>
            {chatData?.chats?.length > 0 ? (
              <div className="chat-sessions">
                {chatData.chats.map((chat) => (
                  <ChatSession 
                    key={chat._id} 
                    chat={chat} 
                    onDelete={handleDeleteChat}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data">
                No chat sessions found. Try adjusting your filters.
              </div>
            )}
            
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;