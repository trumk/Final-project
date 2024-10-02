import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from './config'; 
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'; 
import './style.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate('/'); 
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
      });
  };


  useEffect(() => {
    setValue(localStorage.getItem('email'));
  }, []);

  return (
    <div className="login-container">
    <div className="login-box">
      <div className="welcome-section">
        <h1>Welcome! <FontAwesomeIcon icon={faFaceSmile}/></h1>
        <p>Hi Admin! Please login to access your account</p>
      </div>
      <div className="login-form">
        <input 
          className="input-field" 
          type="email" 
          placeholder="Enter your email" 
        />
        <input 
          className="input-field" 
          type="password" 
          placeholder="Enter your password" 
        />
        <button className="login-btn">Login</button>
        <p>Or</p>
        <button className="google-btn">
          <a href='/login'>Login with Google</a>
        </button>
      </div>
    </div>
  </div>
);
}

export default Login;
