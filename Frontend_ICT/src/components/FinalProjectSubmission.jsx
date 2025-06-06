import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FinalProjectSubmission = ({ s_id }) => {
  const [form, setForm] = useState({
    links: '',
    files: '',
    comments: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentProjectData = async () => {
      try {
        // Check authentication
        if (!api.utils.isAuthenticated()) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        const res = await api.student.getStudentsWithProjects(s_id);
        console.log('Student project data in FinalProjectSubmission is -', res);
        // Note: Currently just logging the data, not using it for anything
        // If you need to use this data, set it to state
      } catch (error) {
        console.error('Error fetching student project data:', error);
        const errorMessage = api.utils.handleError(error);
        alert(errorMessage);
        
        // Handle authentication errors
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      }
    };

    fetchStudentProjectData();
  }, [s_id, navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData using the API utility
      const formData = api.utils.createFormData({
        links: form.links,
        files: form.files,
        comments: form.comments
      });

      console.log('Submitting final project for student:', s_id);

      const result = await api.submission.uploadFinalProject(s_id, formData);
      console.log('Final project submission result:', result);
      
      alert('Congrats!!! You have submitted your final project');
      
      // Reset form after successful submission
      setForm({
        links: '',
        files: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = api.utils.handleError(error);
      alert(`Failed to submit: ${errorMessage}`);
      
      // Handle authentication errors
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        api.utils.removeToken();
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <form className="formStyle" encType="multipart/form-data" onSubmit={submitForm}>
        <h2 className="text-success py-2 text-center"><u>Final Project Submission</u></h2>
        <br />
        <div className="row mb-3">
          <label className="col">Submit your links here:</label>
          <div className="col">
            <textarea
              className="form-control"
              value={form.links}
              onChange={(e) => setForm({ ...form, links: e.target.value })}
              placeholder="Enter project links (GitHub, Demo, Documentation, etc.)"
            ></textarea>
          </div>
        </div>
        <div className="row mb-3">
          <label className="col">Upload your files here:</label>
          <div className="col">
            <input
              className="form-control"
              type="file"
              name="projectFile"
              onChange={(e) => setForm({ ...form, files: e.target.files[0] })}
              accept=".pdf,.doc,.docx,.zip,.rar"
            />
            <small className="text-muted">
              Accepted formats: PDF, DOC, DOCX, ZIP, RAR (Max size: 10MB)
            </small>
          </div>
        </div>
        <div className="row mb-3">
          <label className="col">Your description/comments about the submission:</label>
          <div className="col">
            <textarea
              className="form-control"
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              placeholder="Describe your project, technologies used, challenges faced, etc."
              rows="4"
            ></textarea>
          </div>
        </div>
        <br />
        <div className="d-grid col-4 mx-auto">
          <button type="submit" className="btn btn-success d-grid mx-auto">
            Add Submission
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinalProjectSubmission;