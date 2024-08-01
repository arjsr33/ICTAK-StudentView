import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProjectOverview.css'; 

function ProjectOverview({p_id}) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  // const { id } = useParams();

  useEffect(() => {
    axios.get(`https://ict-student-view-server.vercel.app/api/arjun/projects/${p_id}`)
      .then(response => {
        console.log('Projects fetched:', response.data);
        if (Array.isArray(response.data)) {
          setProjects(response.data);
          if (response.data.length > 0) {
            setSelectedProject(response.data[0]);
            updateBackgroundImage(response.data[0].backgroundImage);
          }
        } else {
          console.error('API response is not an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, [p_id]);

  useEffect(() => {
    if (selectedProject) {
      // updateBackgroundImage(selectedProject.backgroundImage);
    }
  }, [selectedProject]);

  // const updateBackgroundImage = (image) => {
  //   document.body.style.backgroundImage = `url(/images/${image})`;
  //   document.body.style.backgroundSize = 'cover';
  //   document.body.style.backgroundPosition = 'center';
  //   document.body.style.backgroundRepeat = 'no-repeat';
  // };

  return (
    <Container maxWidth="lg" style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      {selectedProject && (
        <Grid container spacing={2} style={{ width: '120%' }}>
          <Grid item xs={12}>
            <Box mt={2} style={{ width: '100%', height: '400px' }}>
              <iframe
                src={selectedProject.project_url.replace('/view?usp=sharing', '/preview')}
                width="100%"
                height="120%"
                title="Project Overview Document"
                style={{ border: 'none' }}
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default ProjectOverview;
