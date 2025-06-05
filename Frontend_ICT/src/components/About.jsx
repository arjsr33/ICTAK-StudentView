import React from 'react';

const About = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About ICT Academy of Kerala</h1>
        <p>Empowering Kerala's digital transformation through world-class technology education</p>
      </div>
      
      <div className="container">
        <section className="content-section">
          <div className="grid grid-2 gap-4">
            <div>
              <h2>Our Mission</h2>
              <p>
                To bridge the gap between academic learning and industry requirements by providing 
                cutting-edge technology education and training programs that prepare students for 
                the digital economy.
              </p>
            </div>
            <div>
              <h2>Our Vision</h2>
              <p>
                To become the leading technology education hub in India, fostering innovation 
                and entrepreneurship while contributing to Kerala's position as a global 
                technology destination.
              </p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Our Impact</h2>
          <div className="grid grid-3 gap-4">
            <div className="stat-card">
              <h3>50,000+</h3>
              <p>Students Trained</p>
            </div>
            <div className="stat-card">
              <h3>500+</h3>
              <p>Industry Partners</p>
            </div>
            <div className="stat-card">
              <h3>95%</h3>
              <p>Placement Rate</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Why Choose ICTAK?</h2>
          <div className="grid grid-2 gap-4">
            <div className="card">
              <h3>Industry-Aligned Curriculum</h3>
              <p>Our courses are designed in collaboration with industry experts to ensure you learn the most relevant and in-demand skills.</p>
            </div>
            <div className="card">
              <h3>Expert Faculty</h3>
              <p>Learn from experienced professionals and industry veterans who bring real-world expertise to the classroom.</p>
            </div>
            <div className="card">
              <h3>Hands-on Learning</h3>
              <p>Practical, project-based learning approach that builds your portfolio and demonstrates your skills to employers.</p>
            </div>
            <div className="card">
              <h3>Placement Support</h3>
              <p>Comprehensive career services including interview preparation, resume building, and direct industry connections.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;