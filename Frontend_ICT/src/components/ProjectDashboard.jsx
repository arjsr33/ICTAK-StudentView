import React, { useEffect, useState } from 'react';
import WeeklySubmission from './WeeklySubmission';
import FinalProjectSubmission from './FinalProjectSubmission';
import { useLocation, useNavigate } from 'react-router-dom';
import VivaVoce from './VivaVoce';
import DiscussionForum from './DiscussionForum';
import References from './References';
import Grades from './Grades';
import ProjectOverview from './ProjectOverview';
import api from '../services/api';

const ProjectDashboard = () => {
  const [isConditionMet, setIsConditionMet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { s_id } = location.state || {};
  
  const [student, setStudent] = useState({
    sp_id: '',
    sp_name: '',
    p_id: '',
    p_name: '',
    start_date: ''
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!api.utils.isAuthenticated()) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        if (!s_id) {
          setError('No student ID provided. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching student project data for:', s_id);
        const res = await api.student.getStudentsWithProjects(s_id);
        console.log('Student data fetched:', res);

        if (res && res.length > 0) {
          const studentData = res[0];
          setStudent({
            sp_id: studentData.sp_id,
            sp_name: studentData.sp_name,
            p_id: studentData.p_id,
            p_name: studentData.p_name,
            start_date: studentData.start_date
          });
          console.log('Student state updated:', studentData);
        } else {
          setError('No project assigned to this student. Please contact your mentor.');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        const errorMessage = api.utils.handleError(error);
        setError(errorMessage);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [s_id, navigate]);

  useEffect(() => {
    if (student.start_date) {
      const start_date = new Date(student.start_date);
      const current_date = new Date();
      
      const week4_date = new Date(start_date);
      week4_date.setDate(week4_date.getDate() + 28);

      console.log(`Start date: ${start_date}`);
      console.log(`Current date: ${current_date}`);
      console.log(`Week 4 date: ${week4_date}`);
      console.log(`Condition met: ${current_date >= week4_date}`);

      setIsConditionMet(current_date >= week4_date);
    }
  }, [student.start_date]);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'PROJECT OVERVIEW', 
      icon: '📋', 
      enabled: true,
      component: ProjectOverview,
      props: { p_id: student.p_id }
    },
    { 
      id: 'references', 
      label: 'REFERENCE MATERIALS', 
      icon: '📚', 
      enabled: true,
      component: References,
      props: { p_id: student.p_id }
    },
    { 
      id: 'weekly', 
      label: 'WEEKLY SUBMISSION', 
      icon: '📝', 
      enabled: true,
      component: WeeklySubmission,
      props: { s_id: s_id }
    },
    { 
      id: 'discussion', 
      label: 'DISCUSSION FORUM', 
      icon: '💬', 
      enabled: true,
      component: DiscussionForum,
      props: { s_id: s_id }
    },
    { 
      id: 'grades', 
      label: 'MY GRADES', 
      icon: '📊', 
      enabled: true,
      component: Grades,
      props: {}
    },
    { 
      id: 'final', 
      label: 'FINAL PROJECT SUBMISSION', 
      icon: '🎯', 
      enabled: isConditionMet,
      component: FinalProjectSubmission,
      props: { s_id: s_id }
    },
    { 
      id: 'viva', 
      label: 'VIVA VOCE', 
      icon: '🎤', 
      enabled: isConditionMet,
      component: VivaVoce,
      props: {}
    }
  ];

  const renderActiveComponent = () => {
    const activeMenuItem = menuItems.find(item => item.id === activeTab);
    if (!activeMenuItem) {
      return <div style={styles.errorMessage}>Component not found</div>;
    }

    const Component = activeMenuItem.component;
    const props = activeMenuItem.props;

    return <Component {...props} />;
  };

  if (loading) {
    return (
      <div style={styles.dashboardContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <h3 style={styles.loadingText}>Loading project dashboard...</h3>
          <p style={styles.loadingSubtext}>Please wait while we fetch your project data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.dashboardContainer}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Dashboard Error</h3>
          <p style={styles.errorMessage}>{error}</p>
          <div style={styles.errorActions}>
            <button 
              style={styles.retryButton} 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button 
              style={styles.backButton} 
              onClick={() => navigate('/StudentDashboard', { state: { s_id: s_id } })}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>PROJECT DASHBOARD</h1>
        <div style={styles.studentInfo}>
          <h3 style={styles.welcomeText}>
            Welcome, <strong>{student.sp_name || 'Student'}</strong>
          </h3>
          {student.p_name && (
            <p style={styles.projectInfo}>
              Project: <strong>{student.p_name}</strong>
            </p>
          )}
          {student.start_date && (
            <p style={styles.dateInfo}>
              Started: <strong>{new Date(student.start_date).toLocaleDateString()}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar Navigation */}
        <div style={styles.sidebar}>
          <nav style={styles.navigation}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <button
                  style={{
                    ...styles.navButton,
                    ...(activeTab === item.id ? styles.navButtonActive : {}),
                    ...(item.enabled ? {} : styles.navButtonDisabled)
                  }}
                  onClick={() => item.enabled && setActiveTab(item.id)}
                  disabled={!item.enabled}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span style={styles.navText}>{item.label}</span>
                  {!item.enabled && (
                    <span style={styles.disabledBadge}>
                      {isConditionMet ? 'Soon' : 'After 4 weeks'}
                    </span>
                  )}
                </button>
                {index < menuItems.length - 1 && <div style={styles.divider}></div>}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          <div style={styles.contentWrapper}>
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingTop: '90px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: 'white',
    textAlign: 'center',
    padding: '2rem',
  },
  
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  
  loadingText: {
    color: 'white',
    marginBottom: '0.5rem',
  },
  
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
  },
  
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: 'white',
    textAlign: 'center',
    padding: '2rem',
  },
  
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  errorTitle: {
    marginBottom: '1rem',
    color: '#ff6b6b',
  },
  
  errorMessage: {
    marginBottom: '2rem',
    maxWidth: '500px',
    background: 'rgba(255, 107, 107, 0.1)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 107, 107, 0.3)',
  },
  
  errorActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  retryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  
  backButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    marginBottom: '2rem',
    borderRadius: '16px',
    margin: '0 2rem 2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  
  title: {
    textAlign: 'center',
    color: '#2D3748',
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  studentInfo: {
    textAlign: 'center',
  },
  
  welcomeText: {
    color: '#4A5568',
    marginBottom: '0.5rem',
    fontSize: '1.3rem',
  },
  
  projectInfo: {
    color: '#718096',
    marginBottom: '0.5rem',
    fontSize: '1.1rem',
  },
  
  dateInfo: {
    color: '#718096',
    fontSize: '1rem',
  },
  
  mainContent: {
    display: 'flex',
    gap: '2rem',
    padding: '0 2rem 2rem',
    minHeight: 'calc(100vh - 300px)',
  },
  
  sidebar: {
    width: '320px',
    flexShrink: 0,
  },
  
  navigation: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  
  navButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'left',
    position: 'relative',
  },
  
  navButtonActive: {
    background: '#667eea',
    color: 'white',
    transform: 'translateX(4px)',
  },
  
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: '#f7fafc',
  },
  
  navIcon: {
    fontSize: '1.2rem',
    width: '24px',
    textAlign: 'center',
  },
  
  navText: {
    flex: 1,
    fontSize: '0.85rem',
  },
  
  disabledBadge: {
    fontSize: '0.7rem',
    background: '#fed7d7',
    color: '#c53030',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontWeight: '500',
  },
  
  divider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '0.5rem 0',
  },
  
  contentArea: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  
  contentWrapper: {
    padding: '2rem',
    height: '100%',
    overflow: 'auto',
  },
};

// Add keyframe animation
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .dashboard-content {
      flex-direction: column !important;
    }
    
    .sidebar {
      width: 100% !important;
    }
    
    .navigation {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
      gap: 0.5rem !important;
    }
    
    .divider {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ProjectDashboard;