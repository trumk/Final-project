import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from "./config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom'; 
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'; 
import './style.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getOneUser, login } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';

function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        localStorage.setItem("email", data.user.email);
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
        setErrorMessage("Google login failed");
      });
  };

  const handleLogin = async () => {
    try {
      const user = { email, password };
      await login(user, dispatch, navigate);  
      await getOneUser(dispatch);    
      navigate("/");                
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Login failed");
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
          <h1>Welcome! <FontAwesomeIcon icon={faFaceSmile}/></h1>
          <p>Hi! Please login to access your account</p>
        </div>
        <div className="login-form">
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
          <button className="login-btn" onClick={handleLogin}>Login</button> 
          {errorMessage && <p className="error-message">{errorMessage}</p>} 
          <p>Or</p>
          <button className="google-btn" onClick={handleGoogleLogin}>
            Login with Google
          </button>
          <p className="register-link">
            Don't have an account? <Link to="/register">Create here</Link> 
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
