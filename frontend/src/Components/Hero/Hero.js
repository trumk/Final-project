import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const images = [
  "/imgs/gre.jpg",
  "/imgs/gre2.jpg",
  "/imgs/gre3.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); 

    return () => clearInterval(imageInterval); 
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      <h1>Welcome to Gree Project</h1>
      <p>Explore the best projects here</p>
      <button>
        <Link className="nav-link" to="/projects">
          Explore Now
        </Link>
      </button>
    </section>
  );
};

export default Hero;