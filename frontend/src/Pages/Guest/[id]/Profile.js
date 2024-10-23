import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUser } from '../../../redux/apiRequest'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../../Components/Navbar';
import Footer from '../../../Components/Footer';
import './Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser); 
  const userProfile = useSelector((state) => state.user.profile); 

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getOneUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  if (!userProfile) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" title="Edit Profile" />
          <img
            src={userProfile.avatar }
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2 className="profile-username">
              {userProfile.userName}
            </h2>
            <p className="profile-email">
              Email: {userProfile.email}
            </p>
            <p className="profile-role">
              Role: {userProfile.role}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
