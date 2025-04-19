// src/pages/Dashboard/Dashboard.js
// Dashboard/Analytics page component

import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  DoughnutController
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import useApiData from '../../hooks/useApiData';
import * as analyticsService from '../../services/analytics';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  DoughnutController,
  Title,
  Tooltip,
  Legend
);

// MetricCard component for displaying summary metrics
const MetricCard = ({ title, value, icon, trend, trendValue }) => {
  const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : '';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h3>{title}</h3>
        <p className="metric-value">{value}</p>
        {trend && (
          <p className={`metric-trend ${trendClass}`}>
            {trendIcon} {trendValue}
          </p>
        )}
      </div>
    </div>
  );
};

// MessageChart component
const MessageChart = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Messages',
        data: data.map(item => item.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
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
      title: {
        display: true,
        text: 'Daily Message Volume',
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Message Statistics</h3>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// FeedbackChart component
const FeedbackChart = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  const chartData = {
    labels: ['Good', 'Bad'],
    datasets: [
      {
        label: 'Feedback Sentiment',
        data: [data.good || 0, data.bad || 0],
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Feedback Sentiment',
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Feedback Sentiment</h3>
      <div className="chart-wrapper">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

// UserActivityChart component
const UserActivityChart = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Active Users',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
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
      title: {
        display: true,
        text: 'Daily Active Users',
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>User Activity</h3>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// TokenUsageChart component
const TokenUsageChart = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Input Tokens',
        data: data.map(item => item.input_tokens),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Output Tokens',
        data: data.map(item => item.output_tokens),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Token Usage',
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Token Usage</h3>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// RagPerformanceChart component
const RagPerformanceChart = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  const chartData = {
    labels: ['Relevance', 'Accuracy', 'Latency', 'Utilization', 'Success Rate'],
    datasets: [
      {
        label: 'Current Performance',
        data: [
          data.relevance_score || 0,
          data.accuracy_score || 0,
          data.latency_score || 0,
          data.utilization_score || 0,
          data.success_rate || 0
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'RAG System Performance',
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>RAG Performance Metrics</h3>
      <div className="chart-wrapper">
        <PolarArea data={chartData} options={options} />
      </div>
    </div>
  );
};

// TopActionsChart component
const TopActionsChart = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  // Sort data by count in descending order and take top 5
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 5);

  const chartData = {
    labels: sortedData.map(item => item.action),
    datasets: [
      {
        label: 'Usage Count',
        data: sortedData.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Top User Actions',
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Top User Actions</h3>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

// LatestActivityTable component
const LatestActivityTable = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="table-loading">Loading latest activity...</div>;
  }

  return (
    <div className="activity-table-container">
      <h3>Latest Activity</h3>
      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((activity, index) => (
              <tr key={index}>
                <td>{activity.user_id}</td>
                <td>{activity.action}</td>
                <td>{new Date(activity.timestamp).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [dateRange, setDateRange] = useState('week');
  
  // Fetch summary metrics
  const { 
    data: summaryData, 
    loading: summaryLoading 
  } = useApiData(
    () => analyticsService.getSummaryMetrics(dateRange),
    [dateRange]
  );
  
  // Fetch daily message statistics
  const { 
    data: messageData, 
    loading: messageLoading 
  } = useApiData(
    () => analyticsService.getDailyMessages(dateRange),
    [dateRange]
  );
  
  // Fetch daily feedback statistics
  const { 
    data: feedbackData, 
    loading: feedbackLoading 
  } = useApiData(
    () => analyticsService.getDailyFeedback(dateRange),
    [dateRange]
  );
  
  // Fetch user activity
  const { 
    data: userActivityData, 
    loading: userLoading 
  } = useApiData(
    () => analyticsService.getUserActivity(dateRange),
    [dateRange]
  );
  
  // Fetch token usage
  const {
    data: tokenUsageData,
    loading: tokenLoading
  } = useApiData(
    () => analyticsService.getTokenUsage(dateRange),
    [dateRange]
  );
  
  // Fetch RAG performance
  const {
    data: ragPerformanceData,
    loading: ragLoading
  } = useApiData(
    () => analyticsService.getRagPerformance(dateRange),
    [dateRange]
  );

  // Handle mock data for development if API is not available
  const [mockData, setMockData] = useState(null);
  
  useEffect(() => {
    // This is temporary mock data for development purposes
    // Remove or comment out in production when real API is connected
    if (!summaryData && !summaryLoading) {
      const dates = Array.from({ length: dateRange === 'week' ? 7 : 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (dateRange === 'week' ? 7 : 30) + i);
        return date.toISOString().split('T')[0];
      });

      setMockData({
        summary: {
          total_messages: 1248,
          unique_users: 156,
          feedback_rating: 87.5,
          trend_messages: 'up',
          trend_messages_value: '12.5%',
          trend_users: 'up',
          trend_users_value: '8.3%',
          trend_rating: 'down',
          trend_rating_value: '2.1%'
        },
        messages: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 100) + 50
        })),
        feedback: {
          good: 78,
          bad: 22
        },
        userActivity: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 30) + 10
        })),
        tokenUsage: dates.map(date => ({
          date,
          input_tokens: Math.floor(Math.random() * 5000) + 2000,
          output_tokens: Math.floor(Math.random() * 8000) + 3000
        })),
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
        ]
      });
    }
  }, [summaryData, summaryLoading, dateRange]);

  // Use real data or fall back to mock data
  const summary = summaryData || mockData?.summary;
  const messages = messageData || mockData?.messages;
  const feedback = feedbackData || mockData?.feedback;
  const userActivity = userActivityData || mockData?.userActivity;
  const tokenUsage = tokenUsageData || mockData?.tokenUsage;
  const ragPerformance = ragPerformanceData || mockData?.ragPerformance;
  const topActions = mockData?.topActions; // This would come from a real endpoint in production
  const latestActivity = mockData?.latestActivity; // This would come from a real endpoint in production

  // Combined loading state
  const isLoading = summaryLoading || messageLoading || feedbackLoading || userLoading || tokenLoading || ragLoading;

  const handleRefresh = () => {
    // Implement refresh functionality
    window.location.reload();
  };

  const handleExport = () => {
    // Implement export report functionality
    alert('Report exported successfully!');
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Dashboard" />
        
        <div className="dashboard-controls">
          <div className="date-range-filter">
            <button 
              className={dateRange === 'week' ? 'active' : ''} 
              onClick={() => setDateRange('week')}
            >
              Last Week
            </button>
            <button 
              className={dateRange === 'month' ? 'active' : ''} 
              onClick={() => setDateRange('month')}
            >
              Last Month
            </button>
          </div>
          <div className="dashboard-actions">
            <button className="action-button" onClick={handleExport}>
              <span className="action-icon">📊</span>
              Export Report
            </button>
            <button className="action-button" onClick={handleRefresh}>
              <span className="action-icon">🔄</span>
              Refresh Data
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading analytics data...
          </div>
        ) : (
          <div className="analytics-content">
            <div className="metrics-cards">
              <MetricCard 
                title="Total Messages" 
                value={summary?.total_messages.toLocaleString() || '0'} 
                icon="📊"
                trend={summary?.trend_messages}
                trendValue={summary?.trend_messages_value}
              />
              <MetricCard 
                title="Unique Users" 
                value={summary?.unique_users.toLocaleString() || '0'} 
                icon="👥"
                trend={summary?.trend_users}
                trendValue={summary?.trend_users_value}
              />
              <MetricCard 
                title="Feedback Rating" 
                value={`${summary?.feedback_rating || 0}%`} 
                icon="⭐"
                trend={summary?.trend_rating}
                trendValue={summary?.trend_rating_value}
              />
              <MetricCard 
                title="Token Usage" 
                value={`${summary?.token_usage?.toLocaleString() || 0}`} 
                icon="💬"
                trend={summary?.trend_tokens}
                trendValue={summary?.trend_tokens_value}
              />
            </div>
            
            <div className="charts-row">
              <MessageChart data={messages} loading={messageLoading} />
              <FeedbackChart data={feedback} loading={feedbackLoading} />
            </div>
            
            <div className="charts-row">
              <UserActivityChart data={userActivity} loading={userLoading} />
              <TokenUsageChart data={tokenUsage} loading={tokenLoading} />
            </div>
            
            <div className="charts-row">
              <RagPerformanceChart data={ragPerformance} loading={ragLoading} />
              <TopActionsChart data={topActions} loading={false} />
            </div>
            
            <div className="activity-section">
              <LatestActivityTable data={latestActivity} loading={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;