import React from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import AIChat from '../../Components/AiChat';
import "./about.css"

function About() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          Welcome to [Your Company Name]! We are dedicated to providing top-notch services that enhance the quality of life for our customers. Our journey began with a vision to revolutionize [your industry or service area] and empower individuals and businesses to achieve their goals.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to deliver exceptional products and services that not only meet but exceed our customers' expectations. We believe in innovation, quality, and integrity in everything we do.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Customer-Centric:</strong> We put our customers at the heart of everything we do.</li>
          <li><strong>Integrity:</strong> We believe in transparency and honesty in our operations.</li>
          <li><strong>Innovation:</strong> We strive for excellence and continuous improvement.</li>
          <li><strong>Community:</strong> We are committed to making a positive impact in our communities.</li>
        </ul>
        <h2>Join Us</h2>
        <p>
          Whether you are a customer, partner, or an aspiring team member, we invite you to join us on our journey. Together, we can create a brighter future.
        </p>
      </div>
      <AIChat />
      <Footer />
    </div>
  );
}

export default About;
