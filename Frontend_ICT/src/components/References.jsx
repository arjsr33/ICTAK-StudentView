import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './References.css';

const References = ({ p_id }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [p_id]);

  const fetchProject = async () => {
    try {
      // Check authentication
      if (!api.utils.isAuthenticated()) {
        alert('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      console.log(`Fetching project references with ID: ${p_id}`);
      const projectData = await api.project.getProjectReferences(p_id);
      
      setProject(projectData);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching project references:', err);
      const errorMessage = api.utils.handleError(err);
      
      if (err.response && err.response.status === 404) {
        setError('Project references not found!');
      } else {
        setError(errorMessage);
      }
      
      setProject(null);
      setLoading(false);
      
      // Handle authentication errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        api.utils.removeToken();
        navigate('/login');
      }
    }
  };

  const handleLinkClick = (url) => {
    if (url && url.trim()) {
      // Ensure the URL has a protocol
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="project-container">
        <div className="loading-message">Loading project references...</div>
      </div>
    );
  }

  return (
    <div className="project-container">
      <h2 className="references-title">Project Reference Materials</h2>
      
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={fetchProject} className="retry-button">
            Try Again
          </button>
        </div>
      )}
      
      {project && (
        <div className="project-details">
          <h3 className="project-name">{project.p_name}</h3>
          <div className="references-grid">
            {[
              { label: 'Reference Material 1', url: project.ref1 },
              { label: 'Reference Material 2', url: project.ref2 },
              { label: 'Reference Material 3', url: project.ref3 },
              { label: 'Reference Material 4', url: project.ref4 }
            ].map((ref, index) => (
              <div key={index} className="reference-item">
                <div className="reference-header">
                  <span className="reference-number">{index + 1}</span>
                  <h4>{ref.label}</h4>
                </div>
                {ref.url && ref.url.trim() ? (
                  <button 
                    onClick={() => handleLinkClick(ref.url)}
                    className="reference-link"
                    title={`Open ${ref.label}`}
                  >
                    <span className="link-icon">🔗</span>
                    Open Reference
                  </button>
                ) : (
                  <div className="no-reference">
                    <span className="no-link-icon">📋</span>
                    No reference available
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="reference-info">
            <h4>How to Use These References:</h4>
            <ul>
              <li>Use these materials to understand the project requirements</li>
              <li>Study the concepts and technologies mentioned</li>
              <li>Follow best practices and coding standards</li>
              <li>Use these as starting points for your research</li>
            </ul>
          </div>
        </div>
      )}
      
      {!project && !error && !loading && (
        <div className="no-project">
          <p>No project selected. Please select a project to view references.</p>
        </div>
      )}
    </div>
  );
};

export default References;