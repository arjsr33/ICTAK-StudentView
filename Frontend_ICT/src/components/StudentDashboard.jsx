import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './StudentDashboard.css';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                setError(errorMessage);
                
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
                if (studentData.s_course) {
                    const projectsRes = await api.project.getAvailableProjects(studentData.s_course);
                    console.log('Projects data is - ', projectsRes);
                    setProjects(projectsRes);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                const errorMessage = api.utils.handleError(error);
                setError(errorMessage);
                
                // If authentication error, redirect to login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    api.utils.removeToken();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (studentData.s_course) {
            fetchProjects();
        }
    }, [studentData.s_course, navigate]);

    const goToProjectDashboard = () => {
        navigate('/ProjectDashboard', { state: { s_id: s_id } });
    };

    const goToProjectDetails = (item) => {
        navigate(`/projectDetails/${item.id}`, { state: { studentData: studentData } });
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A': return '#00D2A3';
            case 'B': return '#4ECDC4';
            case 'C': return '#FFE66D';
            case 'D': return '#FF8C42';
            default: return '#FF4D6D';
        }
    };

    const getScoreStatus = (score) => {
        if (score >= 90) return { color: '#00D2A3', status: 'Excellent' };
        if (score >= 80) return { color: '#4ECDC4', status: 'Very Good' };
        if (score >= 70) return { color: '#FFE66D', status: 'Good' };
        if (score >= 60) return { color: '#FF8C42', status: 'Satisfactory' };
        return { color: '#FF4D6D', status: 'Needs Improvement' };
    };

    if (loading) {
        return (
            <div className="enhanced-dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h3>Loading your dashboard...</h3>
                </div>
            </div>
        );
    }

    return (
    
        <div className="enhanced-dashboard-container">
            <br/><br/>
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="welcome-badge">Welcome Back!</div>
                    <h1 className="hero-title">Student Dashboard</h1>
                    <p className="hero-subtitle">Track your progress and explore exciting projects</p>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Student Info Section */}
                <div className="student-info-section">
                    <div className="info-header">
                        <div className="student-avatar">
                            {studentData.s_name ? studentData.s_name.split(' ').map(n => n[0]).join('') : 'ST'}
                        </div>
                        <div className="student-details">
                            <h2 className="student-name">{studentData.s_name}</h2>
                            <p className="student-course">{studentData.s_course}</p>
                            <div className="student-badges">
                                <span className="mentor-badge">
                                    👨‍🏫 Mentor: {studentData.s_mentor}
                                </span>
                                <span 
                                    className="grade-badge"
                                    style={{ backgroundColor: getGradeColor(studentData.s_grade) }}
                                >
                                    Grade: {studentData.s_grade}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-content">
                                <h4>Start Date</h4>
                                <p>{studentData.s_startdate}</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-content">
                                <h4>Current Score</h4>
                                <div className="score-display">
                                    <span 
                                        className="score-number"
                                        style={{ color: getScoreStatus(studentData.s_exitscore).color }}
                                    >
                                        {studentData.s_exitscore}
                                    </span>
                                    <span className="score-status">
                                        {getScoreStatus(studentData.s_exitscore).status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-content">
                                <h4>Progress</h4>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ 
                                            width: `${Math.min(studentData.s_exitscore, 100)}%`,
                                            backgroundColor: getScoreStatus(studentData.s_exitscore).color
                                        }}
                                    ></div>
                                </div>
                                <span className="progress-text">{studentData.s_exitscore}% Complete</span>
                            </div>
                        </div>

                        <div className="stat-card action-card" onClick={goToProjectDashboard}>
                            <div className="stat-icon">🚀</div>
                            <div className="stat-content">
                                <h4>Quick Access</h4>
                                <p>Project Dashboard</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="projects-section">
                    <div className="section-header">
                        <h2>🌟 Available Projects</h2>
                        <p>Choose from exciting projects tailored to your course</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <div className="error-icon">⚠️</div>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="projects-grid">
                        {projects.map((project, index) => (
                            <div key={project.id} className={`project-card project-card-${index + 1}`}>
                                <div className="project-header">
                                    <div className="project-company">{project.company || 'ICTAK Project'}</div>
                                    <div className="project-badge">New</div>
                                </div>
                                
                                <div className="project-content">
                                    <h3 className="project-title">{project.name}</h3>
                                    <p className="project-description">
                                        {project.details && project.details.length > 120 
                                            ? project.details.substring(0, 120) + '...'
                                            : project.details || 'Exciting project opportunity to enhance your skills and build your portfolio.'
                                        }
                                    </p>
                                    
                                    <div className="project-meta">
                                        <span className="course-tag">
                                            📚 {project.course}
                                        </span>
                                    </div>
                                </div>

                                <div className="project-footer">
                                    <button 
                                        className="project-btn"
                                        onClick={() => goToProjectDetails(project)}
                                    >
                                        Explore Project
                                        <span className="btn-arrow">→</span>
                                    </button>
                                </div>

                                <div className="project-glow"></div>
                            </div>
                        ))}
                    </div>

                    {projects.length === 0 && !error && !loading && (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No Projects Available</h3>
                            <p>Check back later for new project opportunities!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;