import React from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Full Stack Development",
      duration: "6 Months",
      level: "Beginner to Advanced",
      description: "Master both frontend and backend technologies including React, Node.js, and databases.",
      technologies: ["React", "Node.js", "MongoDB", "Express.js"],
      badge: "Popular"
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      duration: "8 Months",
      level: "Intermediate",
      description: "Learn Python, machine learning, and data visualization to become a data scientist.",
      technologies: ["Python", "Machine Learning", "Tableau", "SQL"],
      badge: "Hot"
    },
    {
      id: 3,
      title: "Cloud Computing",
      duration: "4 Months",
      level: "Intermediate",
      description: "Get certified in AWS, Azure, and Google Cloud platforms with hands-on experience.",
      technologies: ["AWS", "Azure", "Google Cloud", "Docker"],
      badge: "New"
    },
    {
      id: 4,
      title: "Cybersecurity",
      duration: "5 Months",
      level: "Intermediate to Advanced",
      description: "Comprehensive cybersecurity training covering ethical hacking and security protocols.",
      technologies: ["Ethical Hacking", "Network Security", "Cryptography", "Penetration Testing"],
      badge: "High Demand"
    },
    {
      id: 5,
      title: "Artificial Intelligence",
      duration: "7 Months",
      level: "Advanced",
      description: "Deep dive into AI, machine learning, and neural networks with practical applications.",
      technologies: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
      badge: "Advanced"
    },
    {
      id: 6,
      title: "Mobile App Development",
      duration: "5 Months",
      level: "Intermediate",
      description: "Build native and cross-platform mobile applications for iOS and Android.",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
      badge: "Trending"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Our Courses</h1>
        <p>Choose from our comprehensive range of technology programs designed for the future</p>
      </div>
      
      <div className="container">
        <section className="content-section">
          <div className="grid grid-auto gap-4">
            {courses.map(course => (
              <div key={course.id} className="course-card card">
                <div className="course-badge-container">
                  <span className="course-badge">{course.badge}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span className="course-duration">{course.duration}</span>
                  <span className="course-level">{course.level}</span>
                </div>
                <div className="course-technologies">
                  {course.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <Link to="/signup" className="btn btn-primary">Enroll Now</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Learning Methodology</h2>
          <div className="grid grid-3 gap-4">
            <div className="card text-center">
              <h3>Theory</h3>
              <p>Comprehensive theoretical foundation covering core concepts and industry best practices.</p>
            </div>
            <div className="card text-center">
              <h3>Practice</h3>
              <p>Hands-on labs, coding exercises, and real-world projects to reinforce learning.</p>
            </div>
            <div className="card text-center">
              <h3>Portfolio</h3>
              <p>Build a professional portfolio showcasing your skills to potential employers.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Courses;