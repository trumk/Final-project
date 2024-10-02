import React, { useState } from "react";
import { auth, googleProvider } from "./config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        localStorage.setItem("email", data.user.email);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during Google sign-up:", error);
        setErrorMessage("Google sign-up failed. Please try again.");
      });
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem("email", userCredential.user.email);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during email sign-up:", error);
        setErrorMessage(
          "Email sign-up failed. Please check your details and try again."
        );
      });
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
            type="username"
            placeholder="Enter your username"
            value={username}
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
          <button className="google-btn" onClick={handleGoogleSignup}>
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
