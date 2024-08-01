import React, { useState } from 'react';
import axios from 'axios';
import './References.css';

const References = ({p_id}) => {
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  const fetchProject = async () => {
    try {
      console.log(`${p_id}`)
      const response = await axios.get(`https://ict-student-view-server.vercel.app/api/fathima/projects/${p_id}`);
      setProject(response.data);
      setError('');
    } catch (err) {
      setError('Project not found!');
      setProject(null);
    }
  };

  return (
    <div className="project-container">
      <input
        type="text"
        value={p_id}
        onChange={(e) => setProjectId(e.target.value)}
        placeholder="Enter Project ID"
      />
      <button onClick={fetchProject}>Get Reference</button>
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