import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from "./config"; 
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom'; 
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'; 
import './style.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login, loginWithProvider } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';

function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const email = result.user.email;
        const providerId = 'google';
        loginWithProvider(email, providerId, dispatch, navigate);
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    
    const user = { email, password };
    const success = await login(user, dispatch, navigate); 
    
    if (!success) {
      setErrorMessage("Incorrect email or password. Please try again.");
    }
  };
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('email') || ''; 
    setEmail(savedEmail);
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="welcome-section">
          <h1>Welcome! <FontAwesomeIcon icon={faFaceSmile} /></h1>
          <p>Hi! Please login to access your account</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}> 
          <input 
            className="input-field" 
            type="email" 
            placeholder="Enter your email" 
            value={email || ''} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="input-field" 
            type="password" 
            placeholder="Enter your password" 
            value={password || ''} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="login-btn">Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>} 
          <p>Or</p>
          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            Login with Google
          </button>
          <p className="register-link">
            Don't have an account? <Link to="/register">Create here</Link> 
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;