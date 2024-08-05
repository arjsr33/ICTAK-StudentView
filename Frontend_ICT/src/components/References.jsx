import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './References.css';

const References = ({ p_id }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [p_id]);

  const fetchProject = async () => {
    try {
      console.log(`Fetching project with ID: ${p_id}`);
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await axios.get(`https://arjun-ictak.vercel.app/api/fathima/projects/${p_id}`, {
        headers: {
          Authorization: token // Include the token in the headers
        }
      });
      setProject(response.data);
      setError('');
    } catch (err) {
      setError('Project not found!');
      setProject(null);
    }
  };

  return (
    <div className="project-container">
      {error && <p className="error">{error}</p>}
      {project && (
        <div className="project-details">
          <h2>{project.p_name}</h2>
          <ul>
            <li><a href={project.ref1} target="_blank" rel="noopener noreferrer">Reference 1</a></li>
            <li><a href={project.ref2} target="_blank" rel="noopener noreferrer">Reference 2</a></li>
            <li><a href={project.ref3} target="_blank" rel="noopener noreferrer">Reference 3</a></li>
            <li><a href={project.ref4} target="_blank" rel="noopener noreferrer">Reference 4</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default References;
