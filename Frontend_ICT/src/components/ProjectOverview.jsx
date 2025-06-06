import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ProjectOverview.css'; 

function ProjectOverview({ p_id }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check authentication
        if (!api.utils.isAuthenticated()) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        console.log(`Fetching project details for ID: ${p_id}`);
        const response = await api.project.getProjectDetails(p_id);
        
        console.log('Projects fetched:', response);
        
        if (Array.isArray(response)) {
          setProjects(response);
          if (response.length > 0) {
            setSelectedProject(response[0]);
            // updateBackgroundImage(response[0].backgroundImage); // Uncomment if you want to update background image
          }
        } else {
          console.error('API response is not an array:', response);
          setError('Invalid project data received');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        const errorMessage = api.utils.handleError(error);
        setError(errorMessage);
        setLoading(false);
        
        // Handle authentication errors
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      }
    };

    if (p_id) {
      fetchProjects();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [p_id, navigate]);

  // Function to update background image (uncomment if needed)
  // const updateBackgroundImage = (image) => {
  //   if (image) {
  //     document.body.style.backgroundImage = `url(/images/${image})`;
  //     document.body.style.backgroundSize = 'cover';
  //     document.body.style.backgroundPosition = 'center';
  //     document.body.style.backgroundRepeat = 'no-repeat';
  //   }
  // };

  const formatDocumentUrl = (url) => {
    if (!url) return '';
    // Convert Google Drive view URL to preview URL for better embedding
    return url.replace('/view?usp=sharing', '/preview');
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    // Re-trigger the useEffect by updating a dependency
    window.location.reload();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="project-overview-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <Typography variant="h6" className="loading-text">
            Loading project overview...
          </Typography>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="project-overview-container">
        <div className="error-container">
          <Typography variant="h6" className="error-title">
            Error Loading Project
          </Typography>
          <Typography variant="body1" className="error-message">
            {error}
          </Typography>
          <button onClick={handleRetry} className="retry-button">
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  if (!selectedProject) {
    return (
      <Container maxWidth="lg" className="project-overview-container">
        <div className="no-project-container">
          <Typography variant="h6" className="no-project-text">
            No project data available
          </Typography>
          <Typography variant="body2" className="no-project-subtitle">
            Please select a project to view its overview
          </Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="project-overview-container">
      <div className="project-header">
        <Typography variant="h4" className="project-title">
          {selectedProject.name}
        </Typography>
        <Typography variant="subtitle1" className="project-course">
          Course: {selectedProject.course}
        </Typography>
        {selectedProject.company && (
          <Typography variant="subtitle2" className="project-company">
            Partner: {selectedProject.company}
          </Typography>
        )}
      </div>

      <Grid container spacing={3} className="project-content">
        <Grid item xs={12}>
          <Box className="document-container">
            <Typography variant="h6" className="document-title">
              Project Overview Document
            </Typography>
            
            {selectedProject.project_url ? (
              <div className="iframe-wrapper">
                <iframe
                  src={formatDocumentUrl(selectedProject.project_url)}
                  width="100%"
                  height="600"
                  title="Project Overview Document"
                  className="project-iframe"
                  onError={(e) => {
                    console.error('Error loading iframe:', e);
                    setError('Failed to load project document');
                  }}
                >
                  <p>
                    Your browser does not support iframes. 
                    <a 
                      href={selectedProject.project_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      Click here to view the document
                    </a>
                  </p>
                </iframe>
              </div>
            ) : (
              <div className="no-document">
                <Typography variant="body1">
                  Project document not available
                </Typography>
                <Typography variant="body2" className="no-document-subtitle">
                  The project overview document will be available soon
                </Typography>
              </div>
            )}
          </Box>
        </Grid>

        {/* Additional project information */}
        {selectedProject.details && (
          <Grid item xs={12}>
            <Box className="project-details-section">
              <Typography variant="h6" className="section-title">
                Project Details
              </Typography>
              <Typography variant="body1" className="project-description">
                {selectedProject.details}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Project overview points */}
        {selectedProject.overview && Array.isArray(selectedProject.overview) && selectedProject.overview.length > 0 && (
          <Grid item xs={12}>
            <Box className="overview-section">
              <Typography variant="h6" className="section-title">
                Overview Points
              </Typography>
              <ul className="overview-list">
                {selectedProject.overview.map((point, index) => (
                  <li key={index} className="overview-item">
                    <Typography variant="body1">{point}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Grid>
        )}

        {/* Quick actions */}
        <Grid item xs={12}>
          <Box className="actions-section">
            <Typography variant="h6" className="section-title">
              Quick Actions
            </Typography>
            <div className="action-buttons">
              {selectedProject.project_url && (
                <a
                  href={selectedProject.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button primary"
                >
                  Open in New Tab
                </a>
              )}
              <button 
                onClick={() => window.print()} 
                className="action-button secondary"
              >
                Print Overview
              </button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProjectOverview;