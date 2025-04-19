// src/pages/Feedback/Feedback.js
// Enhanced feedback data management page component

import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title,
  TimeScale, 
  Tooltip, 
  Legend,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import useApiData from '../../hooks/useApiData';
import * as feedbackService from '../../services/feedback';
import './Feedback.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  DoughnutController,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

// Feedback filter component
const FeedbackFilter = ({ onFilterChange, filters, loading }) => {
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
      sentiment: '',
      priority: '',
      date_from: '',
      date_to: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="feedback-filter">
      <h3>Filter Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
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
            <label htmlFor="sentiment">Sentiment:</label>
            <select
              id="sentiment"
              name="sentiment"
              value={localFilters.sentiment || ''}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              <option value="good">Good</option>
              <option value="bad">Bad</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={localFilters.priority || ''}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="filter-row">
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
        </div>
        
        <div className="filter-actions">
          <button type="submit" disabled={loading}>Apply Filters</button>
          <button type="button" onClick={handleClear} disabled={loading}>Clear</button>
        </div>
      </form>
    </div>
  );
};

// Feedback item component
const FeedbackItem = ({ feedback, onUpdatePriority }) => {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handlePriorityChange = (e) => {
    onUpdatePriority(feedback.id, e.target.value);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    
    try {
      setSubmittingNote(true);
      await feedbackService.addFeedbackNote(feedback.id, note);
      // Success feedback would be better here
      alert('Note added successfully');
      setNote('');
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    } finally {
      setSubmittingNote(false);
    }
  };

  // Badge class based on sentiment
  const sentimentClass = feedback.sentiment === 'good' ? 'good' : 'bad';
  
  // Badge class based on priority
  const priorityClass = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high'
  }[feedback.priority] || 'low';

  return (
    <div className="feedback-item">
      <div className="feedback-header" onClick={toggleExpand}>
        <div className="feedback-badges">
          <span className={`badge sentiment-badge ${sentimentClass}`}>
            {feedback.sentiment}
          </span>
          <span className={`badge priority-badge ${priorityClass}`}>
            {feedback.priority}
          </span>
        </div>
        <div className="feedback-summary">
          <div className="feedback-message">
            {feedback.message_content.length > 100 
              ? `${feedback.message_content.substring(0, 100)}...` 
              : feedback.message_content}
          </div>
        </div>
        <div className="feedback-meta">
          <span className="feedback-user">User: {feedback.user_id}</span>
          <span className="feedback-time">{formatDate(feedback.timestamp)}</span>
          <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="feedback-details">
          <div className="feedback-content">
            <h4>Feedback Content</h4>
            <p>{feedback.message_content}</p>
          </div>
          
          <div className="feedback-actions">
            <div className="priority-update">
              <label htmlFor={`priority-${feedback.id}`}>Update Priority:</label>
              <select 
                id={`priority-${feedback.id}`} 
                value={feedback.priority} 
                onChange={handlePriorityChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="feedback-notes">
            <h4>Admin Notes</h4>
            {feedback.notes && feedback.notes.length > 0 ? (
              <ul className="notes-list">
                {feedback.notes.map((note, index) => (
                  <li key={index} className="note-item">
                    <div className="note-content">{note.content}</div>
                    <div className="note-meta">
                      <span>{note.admin_id}</span>
                      <span>{formatDate(note.timestamp)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-notes">No notes added yet.</p>
            )}
            
            <form className="add-note-form" onSubmit={handleNoteSubmit}>
              <textarea
                placeholder="Add a new note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={submittingNote}
              ></textarea>
              <button type="submit" disabled={!note.trim() || submittingNote}>
                {submittingNote ? 'Adding...' : 'Add Note'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced FeedbackMetrics component with improved visualizations
const FeedbackMetrics = ({ dashboardData, loading, dateRange, onDateRangeChange, onComparePrevious }) => {
  const [comparePrevious, setComparePrevious] = useState(true);
  
  // Handle toggle for comparison with previous period
  const handleComparisonToggle = () => {
    const newValue = !comparePrevious;
    setComparePrevious(newValue);
    onComparePrevious(newValue);
  };
  
  if (loading || !dashboardData) {
    return (
      <div className="feedback-metrics">
        <h3>Feedback Metrics</h3>
        <div className="metrics-loading">
          <div className="spinner"></div>
          Loading metrics...
        </div>
      </div>
    );
  }
  
  // Prepare data for sentiment distribution chart
  const sentimentChartData = {
    labels: ['Good', 'Bad'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [
          dashboardData.sentiment_distribution?.good?.percentage || 0,
          dashboardData.sentiment_distribution?.bad?.percentage || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for priority distribution chart
  const priorityChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Priority Distribution',
        data: [
          dashboardData.priority_distribution?.low?.percentage || 0,
          dashboardData.priority_distribution?.medium?.percentage || 0,
          dashboardData.priority_distribution?.high?.percentage || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for sentiment trends chart
  const sentimentTrendsData = {
    labels: dashboardData.recent_trends?.sentiment?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Good',
        data: dashboardData.recent_trends?.sentiment?.map(item => item.counts.good) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Bad',
        data: dashboardData.recent_trends?.sentiment?.map(item => item.counts.bad) || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="feedback-metrics">
      <div className="metrics-header">
        <h3>Feedback Metrics</h3>
        <div className="metrics-controls">
          <div className="date-range-selector">
            <button 
              className={dateRange === 'week' ? 'active' : ''} 
              onClick={() => onDateRangeChange('week')}
            >
              Last Week
            </button>
            <button 
              className={dateRange === 'month' ? 'active' : ''} 
              onClick={() => onDateRangeChange('month')}
            >
              Last Month
            </button>
            <button 
              className={dateRange === 'quarter' ? 'active' : ''} 
              onClick={() => onDateRangeChange('quarter')}
            >
              Last Quarter
            </button>
          </div>
          <div className="comparison-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={comparePrevious} 
                onChange={handleComparisonToggle} 
              />
              Compare with previous period
            </label>
          </div>
        </div>
      </div>
      
      <div className="metrics-summary">
        <div className="summary-card">
          <h4>Total Feedback</h4>
          <div className="summary-value">{dashboardData.total_count}</div>
          {dashboardData.comparison && comparePrevious && (
            <div className={`comparison-value ${dashboardData.comparison.total_change >= 0 ? 'positive' : 'negative'}`}>
              {dashboardData.comparison.total_change >= 0 ? '+' : ''}
              {dashboardData.comparison.total_change} ({dashboardData.comparison.total_change_percentage}%)
            </div>
          )}
        </div>
        
        <div className="summary-card">
          <h4>Good Sentiment</h4>
          <div className="summary-value">{dashboardData.sentiment_distribution?.good?.percentage || 0}%</div>
          {dashboardData.comparison && dashboardData.comparison.sentiment_changes && comparePrevious && (
            <div className={`comparison-value ${dashboardData.comparison.sentiment_changes.good.change >= 0 ? 'positive' : 'negative'}`}>
              {dashboardData.comparison.sentiment_changes.good.change >= 0 ? '+' : ''}
              {dashboardData.comparison.sentiment_changes.good.change_percentage}%
            </div>
          )}
        </div>
        
        <div className="summary-card">
          <h4>High Priority</h4>
          <div className="summary-value">{dashboardData.high_priority_count}</div>
          {dashboardData.comparison && dashboardData.comparison.priority_changes && comparePrevious && (
            <div className={`comparison-value ${dashboardData.comparison.priority_changes.high.change >= 0 ? 'positive' : 'negative'}`}>
              {dashboardData.comparison.priority_changes.high.change >= 0 ? '+' : ''}
              {dashboardData.comparison.priority_changes.high.change}
            </div>
          )}
        </div>
        
        <div className="summary-card">
          <h4>Time Period</h4>
          <div className="summary-value">{dashboardData.time_period}</div>
        </div>
      </div>
      
      <div className="metrics-charts">
        <div className="chart-container">
          <h4>Sentiment Distribution</h4>
          <div className="chart-wrapper">
            <Doughnut data={sentimentChartData} options={options} />
          </div>
        </div>
        
        <div className="chart-container">
          <h4>Priority Distribution</h4>
          <div className="chart-wrapper">
            <Doughnut data={priorityChartData} options={options} />
          </div>
        </div>
      </div>
      
      <div className="trend-chart-container">
        <h4>Sentiment Trends</h4>
        <div className="chart-wrapper">
          <Line data={sentimentTrendsData} options={lineOptions} />
        </div>
      </div>
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

// Main Feedback component
const Feedback = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    user_id: '',
    sentiment: '',
    priority: '',
    date_from: '',
    date_to: ''
  });
  const [dateRange, setDateRange] = useState('week');
  const [comparePrevious, setComparePrevious] = useState(true);
  const [dashboardDays, setDashboardDays] = useState(30);
  
  // Calculate dashboard days based on date range
  useEffect(() => {
    if (dateRange === 'week') {
      setDashboardDays(7);
    } else if (dateRange === 'month') {
      setDashboardDays(30);
    } else if (dateRange === 'quarter') {
      setDashboardDays(90);
    }
  }, [dateRange]);
  
  // Fetch feedback data
  const { 
    data: feedbackData, 
    loading, 
    error, 
    refetch 
  } = useApiData(
    () => feedbackService.getAllFeedback(page, limit, filters),
    [page, limit, filters]
  );
  
  // Fetch comprehensive dashboard data
  const { 
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useApiData(
    () => feedbackService.getFeedbackDashboard(dashboardDays, comparePrevious),
    [dashboardDays, comparePrevious]
  );

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Handle updating feedback priority
  const handleUpdatePriority = async (feedbackId, priority) => {
    try {
      await feedbackService.updateFeedbackPriority(feedbackId, priority);
      refetch(); // Refresh data after update
      refetchDashboard(); // Refresh dashboard data as well
    } catch (err) {
      console.error('Error updating priority:', err);
      alert('Failed to update priority. Please try again.');
    }
  };

  // Handle date range change for metrics
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  // Handle comparison toggle
  const handleComparePrevious = (value) => {
    setComparePrevious(value);
  };

  // Handle exporting feedback data
  const handleExport = async (format) => {
    try {
      const response = await feedbackService.exportFeedback(format, filters);
      
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feedback-export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting feedback:', err);
      alert('Failed to export feedback data. Please try again.');
    }
  };
  
  // Calculate total pages based on the total count from the API
  const totalPages = feedbackData?.totalPages || 1;

  return (
    <div className="feedback-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Feedback Analytics" />
        
        {/* Display dashboard error if any */}
        {dashboardError && (
          <div className="error-message">
            Error loading dashboard: {dashboardError}
          </div>
        )}
        
        {/* Enhanced Feedback Metrics with Dashboard Data */}
        <FeedbackMetrics 
          dashboardData={dashboardData?.data} 
          loading={dashboardLoading}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onComparePrevious={handleComparePrevious}
        />
        
        <div className="section-divider"></div>
        
        <div className="feedback-controls">
          <FeedbackFilter 
            onFilterChange={handleFilterChange} 
            filters={filters} 
            loading={loading}
          />
          
          <div className="export-controls">
            <h3>Export Data</h3>
            <div className="export-buttons">
              <button 
                onClick={() => handleExport('csv')} 
                disabled={loading || !feedbackData?.feedbacks?.length}
                className="export-btn"
              >
                Export as CSV
              </button>
              <button 
                onClick={() => handleExport('json')} 
                disabled={loading || !feedbackData?.feedbacks?.length}
                className="export-btn"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            Error loading feedback data: {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading feedback data...
          </div>
        ) : (
          <>
            {feedbackData?.feedbacks?.length > 0 ? (
              <div className="feedback-items">
                {feedbackData.feedbacks.map((feedback) => (
                  <FeedbackItem 
                    key={feedback.id} 
                    feedback={feedback} 
                    onUpdatePriority={handleUpdatePriority}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data">
                No feedback entries found. Try adjusting your filters.
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

export default Feedback;