import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUser, updateProfile } from '../../../redux/apiRequest'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../../Components/Navbar';
import Footer from '../../../Components/Footer';
import './Profile.css';
import AIChat from '../../../Components/AiChat';

function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser); 
  const userProfile = useSelector((state) => state.user.profile); 
  const [showModal, setShowModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null); 
  const [newUserName, setNewUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeTab, setActiveTab] = useState(0); 

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getOneUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const handleEditClick = () => {
    setShowModal(true);
    setNewUserName(userProfile.userName);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewAvatar(null);
    setPreviewAvatar(null); 
    setNewUserName('');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file)); 
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    if (newAvatar) formData.append('avatar', newAvatar);
    if (newUserName) formData.append('newUserName', newUserName);
    if (currentPassword) formData.append('currentPassword', currentPassword);
    if (newPassword) formData.append('newPassword', newPassword);

    await dispatch(updateProfile(currentUser.id, formData));
    setShowModal(false);
    setPreviewAvatar(null); 
  };

  if (!userProfile) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <FontAwesomeIcon
            icon={faPencilAlt}
            className="edit-icon"
            title="Edit Profile"
            onClick={handleEditClick}
          />
          <img
            src={userProfile.avatar}
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2 className="profile-username">{userProfile.userName}</h2>
            <p className="profile-email">Email: {userProfile.email}</p>
            <p className="profile-role">Role: {userProfile.role}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <div className="tabs">
              <button
                className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
                onClick={() => setActiveTab(0)}
              >
                Change Avatar
              </button>
              <button
                className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveTab(1)}
              >
                Change Username
              </button>
              <button
                className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveTab(2)}
              >
                Change Password
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 0 && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="file-input"
                  />
                  {previewAvatar && (
                    <img
                      src={previewAvatar}
                      alt="Avatar Preview"
                      className="avatar-preview" 
                    />
                  )}
                </>
              )}
              {activeTab === 1 && (
                <>
                  <input
                    type="text"
                    placeholder="New Username"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field"
                  />
                </>
              )}
              {activeTab === 2 && (
                <>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                  />
                </>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={handleProfileUpdate} className="modal-button primary">
                Save Changes
              </button>
              <button onClick={handleModalClose} className="modal-button secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <AIChat/>
      <Footer />
    </div>
  );
}

export default Profile;