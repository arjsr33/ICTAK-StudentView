import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const FinalProjectSubmission = ({ s_id }) => {
  const [form, setForm] = useState({
    links: '',
    files: '',
    comments: ''
  });

  useEffect(() => {
    const fetchStudentProjectData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const res = await axios.get(`https://arjun-ictak.vercel.app/api/princy/studentswithprojects/${s_id}`, {
          headers: {
            Authorization: token // Include the token in the headers
          }
        });
        console.log('Axios res.data(studentswithprojects) in FinalProjectSubmission is -', res.data);
        // setStudentData(res.data);
      } catch (error) {
        console.error('Error fetching student project data:', error);
      }
    };

    fetchStudentProjectData();
  }, [s_id]);

  const submitForm = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('links', form.links);
    formdata.append('files', form.files);
    formdata.append('comments', form.comments);
    console.log('formdata is -', formdata);

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const result = await axios.post(`https://arjun-ictak.vercel.app/api/princy/uploadProject/${s_id}`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token // Include the token in the headers
        }
      });
      console.log('Axios res.data in FinalProjectSubmission is -', result.data);
      alert('Congrats!!! You have submitted your final project');
    } catch (error) {
      console.error('Error submitting form:', error);
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
            ></textarea>
          </div>
        </div>
        <div className="row mb-3">
          <label className="col">Upload your files here:</label>
          <div className="col">
            <input
              className="form-control"
              type="file"
              name="weeklyFile"
              onChange={(e) => setForm({ ...form, files: e.target.files[0] })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col">Your description/comments about the submission:</label>
          <div className="col">
            <textarea
              className="form-control"
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
            ></textarea>
          </div>
        </div>
        <br />
        <div className="d-grid col-4 mx-auto">
          <button type="submit" className="btn btn-success d-grid mx-auto">Add Submission</button>
        </div>
      </form>
    </div>
  );
};

export default FinalProjectSubmission;
