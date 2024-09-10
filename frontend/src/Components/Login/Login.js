import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from './config'; 
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

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

  const handleGuestLogin = () => {
    localStorage.setItem("email", "guest");
    navigate('/'); // Chuyển hướng đến trang chính như là khách
  };

  useEffect(() => {
    setValue(localStorage.getItem('email'));
  }, []);

  return (
    <div className="container-fluid vh-100">
    <div className="row h-100">
      <div className="col-12 col-md-6 d-flex justify-content-center align-items-center bg-light">
        <div>
          <h1>Welcome to my website!</h1>
          <p>Please login to continue.</p>
        </div>
      </div>

      <div className="col-12 col-md-6 d-flex justify-content-center align-items-center bg-white">
        <div className="card p-4 shadow-lg" style={{ width: '22rem' }}>
          <div className="card-body text-center">
            <h2 className="card-title mb-4">Login</h2>
            <input 
                className="w-100 mb-3 rounded p-2"
                style={{ height: '40px' }}
                type="text" 
                placeholder="Enter your email" 
              />
              <input 
                className="w-100 mb-3 rounded p-2"
                style={{ height: '40px' }}
                type="text" 
                placeholder="Enter your password" 
              />
            <button type="submit" class="btn btn-info mb-3 font-weight-bold"
            style={{ height: '50px', width: '100%', fontSize:'20px' }}>
            Login
            </button>
            <button className="btn btn-danger w-100" onClick={handleGoogleLogin}>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;
