import React from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import AIChat from '../../Components/AiChat';
import './contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Contact() {
  return (
    <div>
      <Navbar />
      <div className="contact-container">
        <h1>Contact Information</h1>
        <div className="contact-card">
          <div className="contact-item">
            <FontAwesomeIcon icon={faUser} className="contact-icon" />
            <div className="contact-info">
              <h2>Name</h2>
              <p>Nguyen Trung</p>
            </div>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
            <div className="contact-info">
              <h2>Email</h2>
              <a href="mailto:nguyentrungtest2292003@gmail.com">nguyentrungtest2292003@gmail.com</a>
            </div>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faGithub} className="contact-icon" />
            <div className="contact-info">
              <h2>GitHub</h2>
              <a href="https://github.com/trumk" target="_blank" rel="noopener noreferrer">github.com/trumk</a>
            </div>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faLinkedin} className="contact-icon" />
            <div className="contact-info">
              <h2>LinkedIn</h2>
              <a href="https://www.linkedin.com/in/trung-nguy%E1%BB%85n-7074a72a9/" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/trung-nguyen
              </a>
            </div>
          </div>
        </div>
      </div>
      <AIChat />
      <Footer />
    </div>
  );
}

export default Contact;