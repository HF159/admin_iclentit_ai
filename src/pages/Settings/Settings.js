// src/pages/Settings/Settings.js
// Settings page component for managing token settings, users, and documents

import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import useApiData from '../../hooks/useApiData';
import * as settingsService from '../../services/settings';
import './Settings.css';

// Token Settings component
const TokenSettings = ({ tokenSettings, loading, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(tokenSettings || { daily_token_limit: 0 });
  const [saving, setSaving] = useState(false);

  // Update local state when props change
  React.useEffect(() => {
    if (tokenSettings && !loading) {
      setLocalSettings(tokenSettings);
    }
  }, [tokenSettings, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onUpdate(localSettings);
      // Success message would be better handled with a toast/notification system
      alert('Token settings updated successfully');
    } catch (err) {
      console.error('Error updating token settings:', err);
      alert('Failed to update token settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-card">
      <h3>Token Settings</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="daily_token_limit">Daily Token Limit:</label>
          <input
            type="number"
            id="daily_token_limit"
            name="daily_token_limit"
            value={localSettings.daily_token_limit}
            onChange={handleInputChange}
            min="0"
            disabled={loading || saving}
          />
          <p className="field-description">
            Maximum number of tokens a user can consume per day.
          </p>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading || saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// User Management component
const UserManagement = ({ users, loading, onBlock, onUnblock, onLoadMore }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userUsage, setUserUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const handleViewUsage = async (userId) => {
    try {
      setLoadingUsage(true);
      const response = await settingsService.getUserTokenUsage(userId);
      setUserUsage(response.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error('Error fetching user token usage:', err);
      alert('Failed to fetch user token usage. Please try again.');
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleCloseUsage = () => {
    setSelectedUser(null);
    setUserUsage(null);
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await onUnblock(userId);
      } else {
        await onBlock(userId);
      }
    } catch (err) {
      console.error('Error updating user block status:', err);
    }
  };

  return (
    <div className="settings-card">
      <h3>User Management</h3>
      
      {selectedUser && userUsage && (
        <div className="user-usage-modal">
          <div className="usage-modal-content">
            <div className="usage-modal-header">
              <h4>User Token Usage - {selectedUser}</h4>
              <button className="close-btn" onClick={handleCloseUsage}>&times;</button>
            </div>
            <div className="usage-modal-body">
              <div className="usage-stat">
                <span>Total Tokens Used:</span>
                <span>{userUsage.total_tokens}</span>
              </div>
              <div className="usage-stat">
                <span>Today's Usage:</span>
                <span>{userUsage.today_tokens}</span>
              </div>
              <div className="usage-stat">
                <span>Last Active:</span>
                <span>{new Date(userUsage.last_active).toLocaleString()}</span>
              </div>
              <div className="usage-history">
                <h5>Recent Usage History</h5>
                <table className="usage-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userUsage.history.map((entry, index) => (
                      <tr key={index}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.tokens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading user data...</div>
      ) : (
        <>
          <div className="users-list">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Status</th>
                  <th>Total Tokens</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.user_id}</td>
                      <td>
                        <span className={`status-badge ${user.is_blocked ? 'blocked' : user.is_limited ? 'limited' : 'normal'}`}>
                          {user.is_blocked ? 'Blocked' : user.is_limited ? 'Limited' : 'Normal'}
                        </span>
                      </td>
                      <td>{user.usage?.total_tokens || 0}</td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="view-btn" 
                            onClick={() => handleViewUsage(user.user_id)}
                            disabled={loadingUsage}
                          >
                            View Usage
                          </button>
                          <button 
                            className={user.is_blocked ? 'unblock-btn' : 'block-btn'} 
                            onClick={() => handleBlockUser(user.user_id, user.is_blocked)}
                          >
                            {user.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No limited or blocked users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {users && users.length > 0 && (
            <div className="load-more">
              <button onClick={onLoadMore} className="load-more-btn">
                Load More Users
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Document Upload component
const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({ description: '', category: '', language: 'en' });
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents on component mount
  React.useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getDocuments();
        setDocuments(response.data.documents || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to fetch documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      await settingsService.uploadDocument(file, metadata);
      
      // Refresh document list
      const response = await settingsService.getDocuments();
      setDocuments(response.data.documents || []);
      
      // Reset form
      setFile(null);
      setMetadata({ description: '', category: '', language: 'en' });
      
      // Success message
      alert('Document uploaded successfully');
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await settingsService.deleteDocument(documentId);
        
        // Remove document from state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        
        // Success message
        alert('Document deleted successfully');
      } catch (err) {
        console.error('Error deleting document:', err);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  return (
    <div className="settings-card">
      <h3>Document Management</h3>
      <p className="card-description">
        Upload documents to enhance the RAG (Retrieval Augmented Generation) system.
        Supported formats: PDF, TXT, DOCX, CSV, JSON.
      </p>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="file">Select File:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.txt,.docx,.csv,.json"
            disabled={uploading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={metadata.description}
            onChange={handleMetadataChange}
            placeholder="Brief description of the document"
            disabled={uploading}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={metadata.category}
              onChange={handleMetadataChange}
              disabled={uploading}
            >
              <option value="">Select a category</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="technical">Technical</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              name="language"
              value={metadata.language}
              onChange={handleMetadataChange}
              disabled={uploading}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
      
      <div className="documents-section">
        <h4>Uploaded Documents</h4>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading documents...</div>
        ) : (
          <div className="documents-list">
            {documents.length > 0 ? (
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Category</th>
                    <th>Uploaded On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="document-name-cell">
                          <span className="document-name">{doc.filename}</span>
                          {doc.description && (
                            <span className="document-description" title={doc.description}>
                              {doc.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{doc.category || 'N/A'}</td>
                      <td>{new Date(doc.uploaded_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No documents uploaded yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Settings component
const Settings = () => {
  // Fetch token settings
  const {
    data: tokenSettings,
    loading: loadingTokenSettings,
    error: tokenSettingsError,
    refetch: refetchTokenSettings
  } = useApiData(
    settingsService.getTokenSettings,
    []
  );

  // Fetch limited users with pagination
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  const [allUsers, setAllUsers] = useState([]);
  
  const {
    data: limitedUsersData,
    loading: loadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useApiData(
    () => settingsService.getLimitedUsers(userPage, userLimit),
    [userPage, userLimit]
  );

  // Update users state when new data is loaded
  React.useEffect(() => {
    if (limitedUsersData && limitedUsersData.users) {
      if (userPage === 1) {
        setAllUsers(limitedUsersData.users);
      } else {
        setAllUsers(prev => [...prev, ...limitedUsersData.users]);
      }
    }
  }, [limitedUsersData, userPage]);

  // Handle token settings update
  const handleUpdateTokenSettings = async (settings) => {
    await settingsService.updateTokenSettings(settings);
    refetchTokenSettings();
  };

  // Handle blocking a user
  const handleBlockUser = async (userId) => {
    await settingsService.blockUser(userId);
    refetchUsers();
  };

  // Handle unblocking a user
  const handleUnblockUser = async (userId) => {
    await settingsService.unblockUser(userId);
    refetchUsers();
  };

  // Handle load more users
  const handleLoadMoreUsers = () => {
    setUserPage(prev => prev + 1);
  };

  return (
    <div className="settings-container">
      <Sidebar />
      <div className="main-content">
        <Header title="System Settings" />
        
        <div className="settings-grid">
          {/* Token Settings Section */}
          {tokenSettingsError && (
            <div className="error-message">
              Error loading token settings: {tokenSettingsError}
            </div>
          )}
          
          <TokenSettings
            tokenSettings={tokenSettings}
            loading={loadingTokenSettings}
            onUpdate={handleUpdateTokenSettings}
          />
          
          {/* User Management Section */}
          {usersError && (
            <div className="error-message">
              Error loading users: {usersError}
            </div>
          )}
          
          <UserManagement
            users={allUsers}
            loading={loadingUsers}
            onBlock={handleBlockUser}
            onUnblock={handleUnblockUser}
            onLoadMore={handleLoadMoreUsers}
          />
          
          {/* Document Upload Section */}
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
};

export default Settings;