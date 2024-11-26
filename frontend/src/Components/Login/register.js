import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faFaceSmile, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { register } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setEmail(filteredValue);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 

    if (!userName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

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
        <form className="register-form" onSubmit={handleRegister}>
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
            onChange={handleEmailChange} 
          />
          <div className="password-container">
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-icon"
            />
          </div>
          <div className="password-container">
            <input
              className="input-field"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-icon"
            />
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>Or</p>
          <p>
            Already have an account? <a href="/login">Sign-in here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;