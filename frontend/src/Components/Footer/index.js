import React from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGithub , faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>Gree Project</h3>
            <p>
              Gree Project is a platform to showcase the most outstanding projects. Our mission is to promote excellence and innovation.
            </p>
          </div>
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h4>Follow Me</h4>
            <div className="social-icons">
            <a href="https://www.facebook.com/nguyentrung2722/" className="social-icon" target="_blank" rel='noopener noreferrer'>
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://github.com/trumk" className="social-icon" target="_blank" rel='noopener noreferrer'>
                <FontAwesomeIcon icon={faGithub } />
              </a>
              <a href="https://www.linkedin.com/in/trung-nguy%E1%BB%85n-7074a72a9/" className="social-icon" target="_blank" rel='noopener noreferrer'>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://www.instagram.com/_trumk/" className="social-icon" target="_blank" rel='noopener noreferrer'>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2024 Gree Project. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
