import React from 'react';

const Placements = () => {
  const placementStats = [
    { company: "TCS", placements: 1200, package: "4.5 LPA" },
    { company: "Infosys", placements: 800, package: "5.2 LPA" },
    { company: "Wipro", placements: 600, package: "4.8 LPA" },
    { company: "Cognizant", placements: 450, package: "5.5 LPA" },
    { company: "HCL", placements: 350, package: "5.0 LPA" }
  ];

  const topRecruiters = [
    "Microsoft", "Google", "Amazon", "IBM", "Accenture", "Deloitte",
    "Capgemini", "Tech Mahindra", "L&T Infotech", "Mindtree", "Zoho", "Freshworks"
  ];

  const successStories = [
    {
      name: "Arjun Krishnan",
      role: "Software Engineer at TCS",
      course: "Full Stack Development",
      package: "6.5 LPA",
      testimonial: "ICTAK's comprehensive training and placement support helped me land my dream job."
    },
    {
      name: "Priya Nair",
      role: "Data Scientist at Infosys",
      course: "Data Science & Analytics",
      package: "8.0 LPA",
      testimonial: "The practical approach and industry connections made all the difference in my career."
    },
    {
      name: "Rahul Menon",
      role: "Cloud Architect at AWS",
      course: "Cloud Computing",
      package: "12.0 LPA",
      testimonial: "ICTAK provided me with cutting-edge skills that are highly valued in the industry."
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Placement Success</h1>
        <p>95% placement rate with leading companies across the globe</p>
      </div>
      
      <div className="container">
        <section className="content-section">
          <h2>Placement Highlights</h2>
          <div className="grid grid-4 gap-4">
            <div className="stat-card">
              <h3>95%</h3>
              <p>Placement Rate</p>
            </div>
            <div className="stat-card">
              <h3>500+</h3>
              <p>Partner Companies</p>
            </div>
            <div className="stat-card">
              <h3>15 LPA</h3>
              <p>Highest Package</p>
            </div>
            <div className="stat-card">
              <h3>5.2 LPA</h3>
              <p>Average Package</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Top Placement Partners</h2>
          <div className="grid grid-auto gap-4">
            {placementStats.map((stat, index) => (
              <div key={index} className="placement-stat card">
                <h3>{stat.company}</h3>
                <p className="placement-number">{stat.placements}+</p>
                <p>Placements</p>
                <div className="package-info">
                  <span className="package-badge">Avg: {stat.package}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Our Recruiters</h2>
          <div className="recruiters-grid">
            {topRecruiters.map((company, index) => (
              <div key={index} className="recruiter-card">
                {company}
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Success Stories</h2>
          <div className="grid grid-auto gap-4">
            {successStories.map((story, index) => (
              <div key={index} className="card">
                <h4>{story.name}</h4>
                <p className="role-title">{story.role}</p>
                <p className="course-info">Course: {story.course}</p>
                <p className="package-info">Package: {story.package}</p>
                <p className="testimonial">"{story.testimonial}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Placement Support Services</h2>
          <div className="grid grid-2 gap-4">
            <div className="card">
              <h3>Career Guidance</h3>
              <p>Personalized career counseling and mentorship from industry experts to help you choose the right career path.</p>
            </div>
            <div className="card">
              <h3>Interview Preparation</h3>
              <p>Mock interviews, technical rounds, HR discussions, and soft skills training to boost your confidence.</p>
            </div>
            <div className="card">
              <h3>Resume Building</h3>
              <p>Professional resume writing workshops and portfolio development to showcase your skills effectively.</p>
            </div>
            <div className="card">
              <h3>Industry Connections</h3>
              <p>Direct networking opportunities with 500+ partner companies and startup ecosystems.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Placements;