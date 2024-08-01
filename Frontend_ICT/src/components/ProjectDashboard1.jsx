import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import WeeklySubmission from './WeeklySubmission';
import axios from 'axios';
import FinalProjectSubmission from './FinalProjectSubmission';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VivaVoce from './VivaVoce';
import DiscussionForum from './DiscussionForum';
import References from './References';
import Grades from './Grades';
import ProjectOverview from './ProjectOverview';

const ProjectDashboard1 = () => {
  const [isConditionMet, setIsConditionMet] = useState(false); // Initialize as false
  const location = useLocation();
  const { s_id } = location.state || {};
  const [student, setStudent] = useState({
    sp_id: '',
    sp_name: '',
    p_id: '',
    p_name: '',
    start_date: ''
  });

  useEffect(() => {
    axios.get(`https://ict-student-view-server.vercel.app/api/princy/studentswithprojects/${s_id}`)
      .then((res) => {
        console.log(`Axios res.data(studentswithprojects) in ProjectDashboard1 is - `);
        console.log(res.data[0]);
        setStudent({
          sp_id: res.data[0].sp_id,
          sp_name: res.data[0].sp_name,
          p_id: res.data[0].p_id,
          p_name: res.data[0].p_name,
          start_date: res.data[0].start_date
        });
      })
      .catch(error => console.error('Error fetching student data:', error));
  }, [s_id]);

  useEffect(() => {
    if (student.start_date) {
      const start_date = new Date(student.start_date);
      const current_date = new Date();
      
      const week4_date = new Date(start_date);
      week4_date.setDate(week4_date.getDate() + 28);

      console.log(`Current date: ${current_date}`);
      console.log(`Week 4 date: ${week4_date}`);

      setIsConditionMet(current_date >= week4_date);
    }
  }, [student.start_date]);

  return (
    <div>
      <Navbar />
      <br />
      <br/>
      <br/>
      <br/>
      <br/>

      <h2 className="text-primary py-2 text-center"><b><u>PROJECT DASHBOARD</u></b></h2>
      <h4 className="py-2 text-center">
        <u>
          <i>Hi</i> <b>{student.sp_name}</b>,  
          <i>You have started on : </i><b>{new Date(student.start_date).toLocaleDateString()}</b>
        </u>
      </h4>
      <div className="row">
        <div className="d-flex">
          <div className="col-2">
            <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <button className="nav-link navLink active" id="v-pills-pjtDoc-tab" data-bs-toggle="pill" data-bs-target="#v-pills-pjtDoc" type="button" role="tab" aria-controls="v-pills-pjtDoc" aria-selected="true">PROJECT OVERVIEW DOCUMENT</button>
              -----------------
              <button className="nav-link navLink" id="v-pills-reference-tab" data-bs-toggle="pill" data-bs-target="#v-pills-reference" type="button" role="tab" aria-controls="v-pills-reference" aria-selected="false">REFERENCE MATERIALS</button>
              -----------------
              <button className="nav-link navLink" id="v-pills-weekly-tab" data-bs-toggle="pill" data-bs-target="#v-pills-weekly" type="button" role="tab" aria-controls="v-pills-weekly" aria-selected="false">WEEKLY SUBMISSION</button>
              -----------------
              <button className="nav-link navLink" id="v-pills-discussion-tab" data-bs-toggle="pill" data-bs-target="#v-pills-discussion" type="button" role="tab" aria-controls="v-pills-discussion" aria-selected="false">DISCUSSION FORUM</button>
              -----------------
              <button className="nav-link navLink" id="v-pills-grades-tab" data-bs-toggle="pill" data-bs-target="#v-pills-grades" type="button" role="tab" aria-controls="v-pills-grades" aria-selected="false">MY GRADES</button>
              -----------------
              {(isConditionMet) ? (
                <button className="nav-link navLink" id="v-pills-final-tab" data-bs-toggle="pill" data-bs-target="#v-pills-final" type="button" role="tab" aria-controls="v-pills-final" aria-selected="false">FINAL PROJECT SUBMISSION</button>
              ) : (
                <div>
                  <button className="nav-link navLink" id="v-pills-final-tab" data-bs-toggle="pill" data-bs-target="#v-pills-final" type="button" role="tab" aria-controls="v-pills-final" aria-selected="false" disabled>FINAL PROJECT SUBMISSION</button>
                  (You are not eligible now!!!)
                </div>
              )}
              -----------------
              {(isConditionMet) ? (
                <button className="nav-link navLink" id="v-pills-viva-tab" data-bs-toggle="pill" data-bs-target="#v-pills-viva" type="button" role="tab" aria-controls="v-pills-viva" aria-selected="false">VIVA VOCE</button>
              ) : (
                <div>
                  <button className="nav-link navLink" id="v-pills-viva-tab" data-bs-toggle="pill" data-bs-target="#v-pills-viva" type="button" role="tab" aria-controls="v-pills-viva" aria-selected="false" disabled>VIVA VOCE</button>
                  (You are not eligible now!!!)
                </div>
              )}
              -----------------
              <br /><br />
              {/* <Link to='/'><button><b><u>Logout</u></b></button></Link> */}
            </div>
          </div>
          <div className="col-0.25">
            <div className="d-flex" style={{ height: 800 }}>
              <div className="vr"></div>
            </div>
          </div>
          <div className="col-9 ms-5">
            <div className="tab-content" id="v-pills-tabContent">
              <div className="tab-pane fade show active" id="v-pills-pjtDoc" role="tabpanel" aria-labelledby="v-pills-pjtDoc-tab" tabIndex="0"><ProjectOverview p_id={student.p_id} /></div>
              <div className="tab-pane fade" id="v-pills-reference" role="tabpanel" aria-labelledby="v-pills-reference-tab" tabIndex="0"><br /><br /><References p_id={student.p_id} /></div>
              <div className="tab-pane fade" id="v-pills-weekly" role="tabpanel" aria-labelledby="v-pills-weekly-tab" tabIndex="0"><WeeklySubmission s_id={s_id} /></div>
              <div className="tab-pane fade" id="v-pills-discussion" role="tabpanel" aria-labelledby="v-pills-discussion-tab" tabIndex="0"><br /><br /><DiscussionForum s_id={s_id} /></div>
              <div className="tab-pane fade" id="v-pills-grades" role="tabpanel" aria-labelledby="v-pills-grades-tab" tabIndex="0"><br /><br /><Grades /></div>
              <div className="tab-pane fade" id="v-pills-final" role="tabpanel" aria-labelledby="v-pills-final-tab" tabIndex="0"><FinalProjectSubmission s_id={s_id} /></div>
              <div className="tab-pane fade" id="v-pills-viva" role="tabpanel" aria-labelledby="v-pills-viva-tab" tabIndex="0"><br /><br /><VivaVoce /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard1;