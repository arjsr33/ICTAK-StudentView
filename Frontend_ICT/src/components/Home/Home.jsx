import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Build Your Career With 
                <span className="highlight"> ICTAK</span>
              </h1>
              <p className="hero-description">
                ICT Academy of Kerala provides world-class education and training programs 
                designed to upskill youth across the state in cutting-edge technologies. 
                Join our comprehensive courses and transform your future with industry-relevant skills.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">50,000+</span>
                  <span className="stat-label">Students Trained</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Industry Partners</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Placement Rate</span>
                </div>
              </div>
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-primary">Get Started</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose ICTAK?</h2>
            <p>Discover what makes us the leading technology education provider in Kerala</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="m6 12 10 5-10 5z"/>
                </svg>
              </div>
              <h3>Industry-Aligned Curriculum</h3>
              <p>Our courses are designed in collaboration with industry experts to ensure you learn the most relevant and in-demand skills.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <h3>Hands-on Projects</h3>
              <p>Learn by doing with real-world projects that build your portfolio and demonstrate your skills to employers.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="m22 21-3-3m0 0a5.5 5.5 0 0 0 0-7.8 5.5 5.5 0 0 0-7.8 0"/>
                </svg>
              </div>
              <h3>Expert Mentorship</h3>
              <p>Get guidance from experienced professionals and industry veterans who are committed to your success.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>Placement Support</h3>
              <p>Comprehensive placement assistance with our network of 500+ industry partners and dedicated career services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="programs-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Programs</h2>
            <p>Explore our most sought-after courses designed for the future</p>
          </div>
          
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-image">
                <div className="program-badge">New</div>
              </div>
              <div className="program-content">
                <h3>Full Stack Development</h3>
                <p>Master both frontend and backend technologies including React, Node.js, and databases.</p>
                <div className="program-meta">
                  <span className="duration">6 Months</span>
                  <span className="level">Beginner to Advanced</span>
                </div>
              </div>
            </div>
            
            <div className="program-card">
              <div className="program-image">
                <div className="program-badge">Popular</div>
              </div>
              <div className="program-content">
                <h3>Data Science & Analytics</h3>
                <p>Learn Python, machine learning, and data visualization to become a data scientist.</p>
                <div className="program-meta">
                  <span className="duration">8 Months</span>
                  <span className="level">Intermediate</span>
                </div>
              </div>
            </div>
            
            <div className="program-card">
              <div className="program-image">
                <div className="program-badge">Hot</div>
              </div>
              <div className="program-content">
                <h3>Cloud Computing</h3>
                <p>Get certified in AWS, Azure, and Google Cloud platforms with hands-on experience.</p>
                <div className="program-meta">
                  <span className="duration">4 Months</span>
                  <span className="level">Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Students Say</h2>
            <p>Success stories from our alumni</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"ICTAK's Full Stack Development course transformed my career. The practical approach and industry connections helped me land my dream job at a top tech company."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div className="author-info">
                  <h4>Arjun Krishnan</h4>
                  <span>Software Engineer at TCS</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The Data Science program at ICTAK provided me with cutting-edge skills and real-world experience. I'm now working as a Data Scientist at a leading fintech company."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">P</div>
                <div className="author-info">
                  <h4>Priya Nair</h4>
                  <span>Data Scientist at Fintech Corp</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"ICTAK's mentorship and project-based learning approach gave me the confidence to start my own tech startup. The skills I learned here are invaluable."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-info">
                  <h4>Rahul Menon</h4>
                  <span>Founder & CEO, TechStart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/assets/logo.png" alt="ICTAK Logo" />
                <h3>ICT Academy of Kerala</h3>
              </div>
              <p>Empowering the next generation of technology professionals with world-class education and industry-relevant skills.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/admissions">Admissions</Link></li>
                <li><Link to="/placements">Placements</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Programs</h4>
              <ul>
                <li><Link to="/programs/fullstack">Full Stack Development</Link></li>
                <li><Link to="/programs/datascience">Data Science</Link></li>
                <li><Link to="/programs/cloud">Cloud Computing</Link></li>
                <li><Link to="/programs/cybersecurity">Cybersecurity</Link></li>
                <li><Link to="/programs/ai">Artificial Intelligence</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p>ICT Academy of Kerala</p>
                    <p>Thiruvananthapuram, Kerala 695014</p>
                  </div>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <p>+91 471 2700 200</p>
                    <p>+91 471 2700 300</p>
                  </div>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <p>info@ictkerala.org</p>
                    <p>admissions@ictkerala.org</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 ICT Academy of Kerala. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Global body styles to fix background issues */
        body {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        .hero-section {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.9), rgba(51, 65, 85, 0.8)), 
                      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ff6b35" stop-opacity="0.1"/><stop offset="100%" stop-color="%23334155" stop-opacity="0.3"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/><g fill="%23ffffff" fill-opacity="0.02"><circle cx="200" cy="200" r="2"/><circle cx="400" cy="100" r="1"/><circle cx="600" cy="300" r="1.5"/><circle cx="800" cy="150" r="1"/><circle cx="300" cy="500" r="2"/><circle cx="700" cy="600" r="1.5"/><circle cx="100" cy="700" r="1"/><circle cx="900" cy="800" r="2"/></g></svg>');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.05));
          pointer-events: none;
        }

        .hero-overlay {
          width: 100%;
          padding: 0; /* Remove padding since hero-content has it */
        }

        .hero-content {
          width: 100%; /* Full width of the page */
          margin: 0;
          color: white;
          text-align: center;
          padding: 0 3rem; /* Add padding for content spacing */
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .highlight {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto 3rem;
          opacity: 0.95;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 0.5rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .container {
          width: 100%; /* Full width of the page */
          margin: 0;
          padding: 0 3rem; /* Increased padding for better content spacing */
        }

        .features-section, .programs-section, .testimonials-section {
          padding: 5rem 0;
          background: transparent;
        }

        .features-section {
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8));
          backdrop-filter: blur(10px);
        }

        .programs-section {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
          backdrop-filter: blur(10px);
        }

        .testimonials-section {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.9), rgba(226, 232, 240, 0.8));
          backdrop-filter: blur(10px);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid, .programs-grid, .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card, .program-card, .testimonial-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .feature-card:hover, .program-card:hover, .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.95);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon svg {
          width: 30px;
          height: 30px;
          color: white;
        }

        .feature-card h3, .program-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .feature-card p, .program-card p {
          color: #64748b;
          line-height: 1.6;
        }

        .program-image {
          height: 200px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 15px;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .program-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #ff6b35;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .program-meta {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .program-meta span {
          background: rgba(241, 245, 249, 0.8);
          color: #475569;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .testimonial-content {
          margin-bottom: 1.5rem;
        }

        .testimonial-content p {
          font-style: italic;
          color: #475569;
          line-height: 1.6;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .author-info h4 {
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .author-info span {
          color: #64748b;
          font-size: 0.9rem;
        }

        .footer {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 3rem 0 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer-logo img {
          width: 40px;
          height: 40px;
        }

        .footer-logo h3 {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .footer-section h4 {
          color: #f1f5f9;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .footer-section p {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section ul li {
          margin-bottom: 0.5rem;
        }

        .footer-section ul li a {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
          color: #ff6b35;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: #ff6b35;
          color: white;
          transform: translateY(-2px);
        }

        .social-links svg {
          width: 20px;
          height: 20px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .contact-item svg {
          width: 20px;
          height: 20px;
          color: #ff6b35;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .contact-item p {
          margin: 0;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-bottom p {
          color: #94a3b8;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #ff6b35;
        }

        @media (max-width: 768px) {
          .hero-stats {
            gap: 2rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 200px;
          }

          .features-grid, .programs-grid, .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-links {
            justify-content: center;
          }

          .contact-item {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          /* Responsive container padding */
          .container {
            padding: 0 2rem;
          }

          .hero-content {
            padding: 0 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .feature-card, .program-card, .testimonial-card {
            padding: 1.5rem;
          }

          .program-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          /* Mobile container padding */
          .container {
            padding: 0 1rem;
          }

          .hero-content {
            padding: 0 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Home;