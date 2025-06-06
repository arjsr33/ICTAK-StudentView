import React, { useState, useEffect } from 'react';
import { Container, Typography, FormControlLabel, Checkbox, Grid, Card, CardContent, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './ProjectDetails.css';

function ProjectDetails() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { studentData } = location.state || {};

  console.log(`Project id is ${id}`);
  console.log('Student data passed as state:', studentData);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check authentication
        if (!api.utils.isAuthenticated()) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        console.log(`Fetching project details for ID: ${id}`);
        const response = await api.project.getProjectDetails(id);
        
        console.log('Projects fetched:', response); 
        setProjects(response);
        
        if (response.length > 0) {
          setSelectedProject(response[0]);
          setSelectedProjectId(response[0].id); // Use the project ID instead of _id
        } else {
          setError('No project found with this ID');
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

    if (id) {
      fetchProjects();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [id, navigate]);

  const handleAcceptanceChange = (event) => {
    setIsAccepted(event.target.checked);
  };

  const handleSelectAndProceed = async () => {
    if (!isAccepted) {
      alert('Please accept the terms to proceed.');
      return;
    }

    if (!studentData) {
      alert('Student data not available. Please go back and try again.');
      return;
    }

    console.log('Proceeding with project:', selectedProject.name);
    await saveProjectSelection();
  };

  const saveProjectSelection = async () => {
    setSubmitting(true);
    
    try {
      console.log('Saving project selection with data:', {
        sp_id: studentData.s_id,
        sp_name: studentData.s_name,
        p_id: selectedProjectId,
        p_name: selectedProject.name,
        start_date: new Date().toISOString()
      });

      const response = await api.project.selectProject(
        studentData.s_id,
        studentData.s_name,
        selectedProjectId,
        selectedProject.name,
        new Date().toISOString()
      );
      
      console.log('Project selection saved:', response);
      alert('Project selected successfully!');
      goToProjectDashboard();
    } catch (error) {
      console.error('Error saving project selection:', error);
      const errorMessage = api.utils.handleError(error);
      
      if (error.response) {
        if (error.response.status === 400) {
          alert(error.response.data.message || errorMessage);
        } else if (error.response.status === 200) {
          console.log('Student already has a project');
          alert('You already have a project selected. Redirecting to dashboard...');
          goToProjectDashboard();
        } else {
          alert(`Failed to select project: ${errorMessage}`);
        }
        
        // Handle authentication errors
        if (error.response.status === 401 || error.response.status === 403) {
          api.utils.removeToken();
          navigate('/login');
        }
      } else {
        alert(`Failed to select project: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goToProjectDashboard = () => {
    navigate('/ProjectDashboard', { 
      state: { 
        s_id: studentData.s_id, 
        p_id: selectedProjectId 
      } 
    });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    // Re-trigger the useEffect
    window.location.reload();
  };

  if (loading) {
    return (
      <Container maxWidth={false} className="dashboard-container loading-state">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <Typography variant="h6" className="loading-text">
            Loading project details...
          </Typography>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} className="dashboard-container error-state">
        <div className="error-content">
          <Typography variant="h5" className="error-title">
            Error Loading Project
          </Typography>
          <Typography variant="body1" className="error-message">
            {error}
          </Typography>
          <div className="error-actions">
            <Button onClick={handleRetry} variant="contained" className="retry-button">
              Try Again
            </Button>
            <Button onClick={handleGoBack} variant="outlined" className="back-button">
              Go Back
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!selectedProject) {
    return (
      <Container maxWidth={false} className="dashboard-container no-project-state">
        <div className="no-project-content">
          <Typography variant="h6" className="no-project-text">
            No project details available
          </Typography>
          <Button onClick={handleGoBack} variant="contained" className="back-button">
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      className="dashboard-container"
      style={{ 
        backgroundImage: selectedProject.backgroundImage 
          ? `url(/images/${selectedProject.backgroundImage})` 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="project-details-overlay">
        <div className="project-header">
          <Typography variant="h3" className="project-title">
            {selectedProject.name}
          </Typography>
          <Typography variant="h6" className="project-course">
            Course: {selectedProject.course}
          </Typography>
          {selectedProject.company && (
            <Typography variant="subtitle1" className="project-company">
              Partner: {selectedProject.company}
            </Typography>
          )}
        </div>

        <Grid container spacing={3} className="project-details">
          {/* Prerequisites */}
          <Grid item xs={12} md={3}>
            <Card className="info-card prerequisite-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  📚 Prerequisites
                </Typography>
                <ul className="prerequisites-list">
                  {selectedProject.prerequisiteKnowledge && selectedProject.prerequisiteKnowledge.length > 0 ? (
                    selectedProject.prerequisiteKnowledge.map((item, index) => (
                      <li key={index} className="prerequisite-item">{item}</li>
                    ))
                  ) : (
                    <li className="no-data">No specific prerequisites listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={6}>
            <Card className="info-card details-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  📋 Project Description
                </Typography>
                <Typography variant="body1" className="project-description">
                  {selectedProject.details || 'No detailed description available.'}
                </Typography>
                
                {selectedProject.overview && Array.isArray(selectedProject.overview) && selectedProject.overview.length > 0 && (
                  <>
                    <Typography variant="h6" className="overview-title">
                      🎯 Overview
                    </Typography>
                    <div className="overview-content">
                      {selectedProject.overview.map((paragraph, index) => (
                        <Typography key={index} variant="body1" className="overview-paragraph">
                          {paragraph}
                        </Typography>
                      ))}
                    </div>
                  </>
                )}

                <div className="selection-section">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAccepted}
                        onChange={handleAcceptanceChange}
                        name="acceptTerms"
                        className="acceptance-checkbox"
                      />
                    }
                    label="I accept that once selected I cannot change the project in future"
                    className="acceptance-label"
                  />
                  
                  <div className="action-buttons">
                    <Button
                      variant="outlined"
                      onClick={handleGoBack}
                      className="back-btn"
                      disabled={submitting}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSelectAndProceed}
                      disabled={!isAccepted || submitting}
                      className="proceed-btn"
                    >
                      {submitting ? 'Selecting...' : 'Select Project'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Opportunities */}
          <Grid item xs={12} md={3}>
            <Card className="info-card opportunities-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  💼 Career Opportunities
                </Typography>
                <ul className="opportunities-list">
                  {selectedProject.jobOpportunities && selectedProject.jobOpportunities.length > 0 ? (
                    selectedProject.jobOpportunities.map((item, index) => (
                      <li key={index} className="opportunity-item">{item}</li>
                    ))
                  ) : (
                    <li className="no-data">Career opportunities will be updated</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default ProjectDetails;