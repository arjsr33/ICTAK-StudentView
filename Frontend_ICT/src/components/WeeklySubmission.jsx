import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const WeeklySubmission = ({ s_id }) => {
  const [s_start_date, set_s_start_date] = useState(null);

  const [week1ConditionMet, set_week1ConditionMet] = useState(false);
  const [week2ConditionMet, set_week2ConditionMet] = useState(false);
  const [week3ConditionMet, set_week3ConditionMet] = useState(false);
  const [week4ConditionMet, set_week4ConditionMet] = useState(false);

  const [form, setForm] = useState({
    selectedWeek: '',
    links: '',
    files: '',
    comments: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://ict-student-view-server.vercel.app/api/princy/studentswithprojects/${s_id}`);
        console.log(`Axios res.data[0].start_date (studentswithprojects) in WeeklySubmission is - `);
        console.log(res.data[0].start_date);
        set_s_start_date(res.data[0].start_date);
      } catch (error) {
        console.error('Error fetching student project data:', error);
      }
    };

    fetchData();
  }, [s_id]);

  useEffect(() => {
    if (s_start_date) {
      const startDate = new Date(s_start_date);
      const currentDate = new Date();

      const week1_date = new Date(startDate);
      week1_date.setDate(week1_date.getDate() + 7);
      set_week1ConditionMet(currentDate >= week1_date);

      const week2_date = new Date(startDate);
      week2_date.setDate(week2_date.getDate() + 14);
      set_week2ConditionMet(currentDate >= week2_date);

      const week3_date = new Date(startDate);
      week3_date.setDate(week3_date.getDate() + 21);
      set_week3ConditionMet(currentDate >= week3_date);

      const week4_date = new Date(startDate);
      week4_date.setDate(week4_date.getDate() + 28);
      set_week4ConditionMet(currentDate >= week4_date);
    }
  }, [s_start_date]);

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('selectedWeek', form.selectedWeek);
    formData.append('links', form.links);
    formData.append('files', form.files);
    formData.append('comments', form.comments);
    console.log('formdata is -');
    console.log(formData);

    try {
      const result = await axios.post(`https://ict-student-view-server.vercel.app/api/princy/uploadWeek/${s_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(`Axios res.data(projects) is - `);
      console.log(result.data);
      alert('Congrats!!! You have submitted your work for the week');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <form className="formStyle" encType="multipart/form-data" onSubmit={submitForm}>
        <h2 className="text-primary py-2 text-center">
          <u>Weekly Submission</u>
        </h2>
        <br />
        <div className="row mb-3">
          <label className="col">Select the week of submission:</label>
          <div className="col">
            <select
              className="form-select"
              aria-label="Default select example"
              value={form.selectedWeek}
              onChange={(e) => {
                setForm({ ...form, selectedWeek: e.target.value });
              }}
            >
              <option value="0">--Select--</option>
              {week1ConditionMet ? (
                <option value="1">Week 1</option>
              ) : (
                <option value="1" disabled>
                  Week 1 (You are not eligible now!!)
                </option>
              )}
              {week2ConditionMet ? (
                <option value="2">Week 2</option>
              ) : (
                <option value="2" disabled>
                  Week 2 (You are not eligible now!!)
                </option>
              )}
              {week3ConditionMet ? (
                <option value="3">Week 3</option>
              ) : (
                <option value="3" disabled>
                  Week 3 (You are not eligible now!!)
                </option>
              )}
              {week4ConditionMet ? (
                <option value="4">Week 4</option>
              ) : (
                <option value="4" disabled>
                  Week 4 (You are not eligible now!!)
                </option>
              )}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label className="col">Submit your links here:</label>
          <div className="col">
            <textarea
              className="form-control"
              value={form.links}
              onChange={(e) => {
                setForm({ ...form, links: e.target.value });
              }}
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
              onChange={(e) => {
                setForm({ ...form, files: e.target.files[0] });
              }}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col">Your description/comments about the submission:</label>
          <div className="col">
            <textarea
              className="form-control"
              value={form.comments}
              onChange={(e) => {
                setForm({ ...form, comments: e.target.value });
              }}
            ></textarea>
          </div>
        </div>
        <br />
        <div className="d-grid col-4 mx-auto">
          <button type="submit" className="btn btn-primary d-grid mx-auto">
            Add Submission
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklySubmission;
