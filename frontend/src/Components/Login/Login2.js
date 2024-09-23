import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, googleProvider } from "./config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import './style2.css'; 

function Login2() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
      });
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="welcome-section">
          <h1>
            Welcome! <FontAwesomeIcon icon={faFaceSmile} />
          </h1>
          <p>Please login to access your account</p>
        </div>
        <div className="login-form">
          <button className="google-btn" onClick={handleGoogleLogin}>
            Login with Google
          </button>
          <p>Or</p>
          <a href="/loginAdmin">Login with admin account</a>
        </div>
      </div>
    </div>
  );
}

export default Login2;
