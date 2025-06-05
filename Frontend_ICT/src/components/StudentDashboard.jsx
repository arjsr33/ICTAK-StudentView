import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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

    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    useEffect(() => {
        if (!token) {
            alert('You are not logged in. Please log in.');
            navigate('/login');
            return;
        }

        const fetchStudentData = async () => {
            try {
                const res = await axios.get(`https://arjun-ictak.vercel.app/api/princy/studentCourse/${s_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                });
                console.log('Axios res.data(student) is - ', res.data);
                setStudentData(res.data);
            } catch (error) {
                console.error('Error fetching student data:', error);
                if (error.response && error.response.status === 403) {
                    alert('Your session has expired or you do not have permission. Please log in again.');
                    localStorage.removeItem('token'); // Clear the token
                    navigate('/login'); // Redirect to login page if session is expired
                }
            }
        };

        fetchStudentData();
    }, [s_id, token, navigate]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`https://arjun-ictak.vercel.app/api/princy/availableProjects/${studentData.s_course}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                });
                console.log('Axios res.data(projects) is - ', res.data);
                setProjects(res.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                if (error.response && error.response.status === 403) {
                    alert('Your session has expired or you do not have permission. Please log in again.');
                    localStorage.removeItem('token'); // Clear the token
                    navigate('/login'); // Redirect to login page if session is expired
                }
            }
        };

        if (studentData.s_course) {
            fetchProjects();
        }
    }, [studentData.s_course, token, navigate]);

    function postStdPjt() {
        axios.post(`https://arjun-ictak.vercel.app/api/princy/postStdPjt`, {
            sp_id: "S0011",
            sp_name: "Shamna",
            p_id: "P004",
            p_name: "Fingerprint Detection System"
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the headers
            }
        })
        .then((res) => {
            console.log('Axios postStdPjt is - ', res.data);
        })
        .catch((error) => {
            console.error('Error posting student project:', error);
            if (error.response && error.response.status === 403) {
                alert('Your session has expired or you do not have permission. Please log in again.');
                localStorage.removeItem('token'); // Clear the token
                navigate('/login'); // Redirect to login page if session is expired
            }
        });
    }

    function goToProjectDashboard() {
        navigate('/ProjectDashboard1', { state: { s_id: s_id } });
    }

    function goToProjectDetails(item) {
        navigate(`/projectDetails/${item.id}`, { state: { studentData: studentData } });
    }

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
