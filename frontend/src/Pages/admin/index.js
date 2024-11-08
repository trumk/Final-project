import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComments, getAllProjects, getAllUsers, logout } from '../../redux/apiRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faUser, faComments, faPlus, faSignOutAlt, faCog, faDatabase  } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const projects = useSelector((state) => state.project?.allProjects);
  const users = useSelector((state) => state.user?.allUsers);
  const comments = useSelector((state) => state.project?.comments);

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getAllUsers());
    dispatch(getAllComments());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logout(dispatch);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Navbar for logout */}
      <div className="d-flex justify-content-between mb-4">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-logout" onClick={() => setShowLogoutModal(true)}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>

      <div className="row">
        {/* Card 1: Projects */}
        <div className="col-md-4">
          <div className="card card-custom bg-light mb-3 shadow">
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faProjectDiagram} className="me-2" /> Projects
            </div>
            <div className="card-body">
              <h5 className="card-title">{projects ? projects.length : 0} Projects</h5>
              <p className="card-text">Manage all submitted projects.</p>
              <button className="btn btn-custom">
                <a href='/admin/project' className="text-white">View projects</a>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Users */}
        <div className="col-md-4">
          <div className="card card-custom bg-light mb-3 shadow">
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faUser} className="me-2" /> Users
            </div>
            <div className="card-body">
              <h5 className="card-title">{users ? users.length : 0} Users</h5>
              <p className="card-text">Manage registered users.</p>
              <button className="btn btn-custom">
                <a href='/admin/user' className="text-white">View users</a>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Comments */}
        <div className="col-md-4">
          <div className="card card-custom bg-light mb-3 shadow">
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faComments} className="me-2" /> Comments
            </div>
            <div className="card-body">
              <h5 className="card-title">{comments ? comments.length : 0} Comments</h5>
              <p className="card-text">Review and manage comments.</p>
              <button className="btn btn-custom">
                <a href='/admin/comment' className="text-white">View comments</a>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Card 4: Recent Activities */}
        <div className="col-md-6">
          <div className="card card-custom bg-light mb-3 shadow">
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faCog} className="me-2" /> Recent Activities
            </div>
            <div className="card-body">
              <h5 className="card-title">Latest Updates</h5>
              <ul className="list-group">
                {projects && projects.length > 0 && (
                  <li className="list-group-item">Project "{projects[0].name}" updated</li>
                )}
                {users && users.length > 0 && (
                  <li className="list-group-item">New user "{users[0].userName}" registered</li>
                )}
                {comments && comments.length > 0 && (
                  <li className="list-group-item">Comment added on "{comments[0].projectId}"</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Card 5: Admin Actions */}
        <div className="col-md-6">
          <div className="card card-custom bg-light mb-3 shadow">
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faCog} className="me-2" /> Admin Actions
            </div>
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <button className="btn btn-primary mb-2 me-2">
                <FontAwesomeIcon icon={faPlus} />{' '}
                <a href='/admin/project/create' className="text-white">Add new project</a>
              </button>
              <button className="btn btn-secondary mb-2 me-2">Manage Users</button>
              <button className="btn btn-danger mb-2 me-2">Settings</button>
              <button className="btn btn-warning mb-2" onClick={() => navigate('/admin/backup')}>
                <FontAwesomeIcon icon={faDatabase} /> Backup Database
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Logout Confirmation */}
      {showLogoutModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleLogout}>Yes, Logout</button>
              <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
