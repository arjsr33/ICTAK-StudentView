import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { s_id } = location.state || {};
    const [studentData, setStudentData] = useState({
        s_id: '',
        s_name: '',
        s_course: '',
        s_startdate: '',
        s_mentor: '',
        s_grade: '',
        s_exitscore: 0,
    });
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Check authentication
        if (!api.utils.isAuthenticated()) {
            alert('You are not logged in. Please log in.');
            navigate('/login');
            return;
        }

        const fetchStudentData = async () => {
            try {
                const studentRes = await api.student.getStudentCourse(s_id);
                console.log('Student data is - ', studentRes);
                setStudentData(studentRes);
            } catch (error) {
                console.error('Error fetching student data:', error);
                const errorMessage = api.utils.handleError(error);
                alert(errorMessage);
                
                // If authentication error, redirect to login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    api.utils.removeToken();
                    navigate('/login');
                }
            }
        };

        fetchStudentData();
    }, [s_id, navigate]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsRes = await api.project.getAvailableProjects(studentData.s_course);
                console.log('Projects data is - ', projectsRes);
                setProjects(projectsRes);
            } catch (error) {
                console.error('Error fetching projects:', error);
                const errorMessage = api.utils.handleError(error);
                alert(errorMessage);
                
                // If authentication error, redirect to login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    api.utils.removeToken();
                    navigate('/login');
                }
            }
        };

        if (studentData.s_course) {
            fetchProjects();
        }
    }, [studentData.s_course, navigate]);


    const goToProjectDashboard = () => {
        navigate('/ProjectDashboard1', { state: { s_id: s_id } });
    };

    const goToProjectDetails = (item) => {
        navigate(`/projectDetails/${item.id}`, { state: { studentData: studentData } });
    };

    return (
        <div>
            <h2 className="text-primary py-2 text-center"><u>The Student Dashboard</u></h2>
            <div className="row">
                <br /><br /><br />
                <div className="col-3">
                    <br /><br /><br />
                    <ol className="list-group list-group-flush" id="studentList">
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold"><u>Name</u> : {studentData.s_name}</div>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold"><u>Course</u> : {studentData.s_course}</div>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold"><u>Mentor</u> : {studentData.s_mentor}</div>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold"><u>Started on</u> : {studentData.s_startdate}</div>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold"><u>Score</u> : {studentData.s_exitscore}</div>
                            </div>
                        </li>
                    </ol>
                </div>
                
                <div className="col-8">
                    <h3><u>Available Projects</u></h3><br />
                    <div className="row">
                        {projects.map((item, i) => (
                            <div className="col" key={i}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <p className="card-text"><i>COURSE : {item.course}</i></p>
                                        <h5 className="card-title"><u>{item.name}</u></h5>
                                        <p className="card-text">{item.details}...</p>
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={() => goToProjectDetails(item)}>Read more</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;