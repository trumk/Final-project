import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { register } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      const user = { userName, email, password };
      console.log("User data:", user); 
      await register(user, dispatch);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="welcome-section">
          <h1>
            Welcome! <FontAwesomeIcon icon={faFaceSmile} />
          </h1>
          <p>Hi! Please register to create your account</p>
        </div>
        <div className="register-form">
          <input
            className="input-field"
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-field"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>Or</p>
          <p>
            Already have an account? <a href="/login">Sign-in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
