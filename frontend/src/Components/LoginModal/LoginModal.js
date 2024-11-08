import React from 'react';
import { useNavigate } from 'react-router-dom';
import './modal.css';

function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    navigate('/login');
    onClose(); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>You need to login to do this action</h2>
        <div className="modal-buttons">
          <button className="go-to-login-btn" onClick={handleGoToLogin}>
            Go to Login
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;