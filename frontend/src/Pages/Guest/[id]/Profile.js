import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUser, updateProfile } from '../../../redux/apiRequest'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../../Components/Navbar';
import Footer from '../../../Components/Footer';
import './Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser); 
  const userProfile = useSelector((state) => state.user.profile); 
  const [showModal, setShowModal] = useState(false); // Trạng thái để hiển thị modal
  const [newAvatar, setNewAvatar] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
    setNewUserName('');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleAvatarChange = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    if (newAvatar) formData.append('file', newAvatar);
    if (newUserName) formData.append('newUserName', newUserName);
    if (currentPassword) formData.append('currentPassword', currentPassword);
    if (newPassword) formData.append('newPassword', newPassword);

    await dispatch(updateProfile(currentUser.id, formData));
    setShowModal(false);
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

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <input
              type="text"
              placeholder="New Username"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleProfileUpdate}>Save Changes</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;
