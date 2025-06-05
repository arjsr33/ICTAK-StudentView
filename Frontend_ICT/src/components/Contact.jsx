import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for admissions, queries, or any assistance</p>
      </div>
      
      <div className="container">
        <div className="grid grid-2 gap-5">
          <div>
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>

          <div>
            <h2>Contact Information</h2>
            <div className="contact-info">
              <div className="contact-item">
                <h4>📍 Address</h4>
                <p>
                  ICT Academy of Kerala<br />
                  Thiruvananthapuram, Kerala 695014<br />
                  India
                </p>
              </div>
              <div className="contact-item">
                <h4>📞 Phone</h4>
                <p>+91 471 2700 200</p>
                <p>+91 471 2700 300</p>
              </div>
              <div className="contact-item">
                <h4>✉️ Email</h4>
                <p>info@ictkerala.org</p>
                <p>admissions@ictkerala.org</p>
              </div>
              <div className="contact-item">
                <h4>🕒 Office Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="contact-item">
              <h4>🚗 How to Reach Us</h4>
              <p>
                Located in the heart of Thiruvananthapuram, easily accessible by public transport. 
                The nearest railway station is Thiruvananthapuram Central, approximately 5 km away.
              </p>
            </div>
          </div>
        </div>

        <section className="content-section">
          <h2>Frequently Asked Questions</h2>
          <div className="grid grid-2 gap-4">
            <div className="card">
              <h4>What are the admission requirements?</h4>
              <p>Basic computer knowledge and 12th grade completion. Specific course requirements may vary.</p>
            </div>
            <div className="card">
              <h4>Do you provide placement assistance?</h4>
              <p>Yes, we have a dedicated placement cell with 95% placement rate and 500+ industry partners.</p>
            </div>
            <div className="card">
              <h4>Are the courses industry-relevant?</h4>
              <p>All our courses are designed in collaboration with industry experts and updated regularly.</p>
            </div>
            <div className="card">
              <h4>What is the fee structure?</h4>
              <p>Fee varies by course. We also offer scholarship programs and flexible payment options.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;