import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComments, getAllProjects, getAllUsers, logout } from '../../redux/apiRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faUser, faComments, faSignOutAlt, faDatabase, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';
import Chart from '../../Components/Chart/Chart';

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
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/admin')} title="Dashboard">
            <FontAwesomeIcon icon={faChartLine} /> <span>Dashboard</span>
          </li>
          <li onClick={() => navigate('/admin/project')} title="Projects">
            <FontAwesomeIcon icon={faProjectDiagram} /> <span>Projects</span>
          </li>
          <li onClick={() => navigate('/admin/user')} title="Users">
            <FontAwesomeIcon icon={faUser} /> <span>Users</span>
          </li>
          <li onClick={() => navigate('/admin/comment')} title="Comments">
            <FontAwesomeIcon icon={faComments} /> <span>Comments</span>
          </li>
          <li onClick={() => navigate('/admin/backup')} title="Backup Database">
            <FontAwesomeIcon icon={faDatabase} /> <span>Backup</span>
          </li>
          <li onClick={() => navigate('/')} title="Customer side">
            <FontAwesomeIcon icon={faUsers} /> <span>Customer side</span>
          </li>
          <li onClick={() => setShowLogoutModal(true)} title="Logout">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <nav className="dashboard-navbar">
          <h1 className="dashboard-title">Dashboard Overview</h1>
        </nav>

        <div className="dashboard-cards">
          <div className="card-custom project-card">
            <FontAwesomeIcon icon={faProjectDiagram} className="card-icon" />
            <div className="card-content">
              <h5>{projects ? projects.length : 0} Projects</h5>
              <p>Manage all submitted projects.</p>
            </div>
          </div>

          <div className="card-custom user-card">
            <FontAwesomeIcon icon={faUser} className="card-icon" />
            <div className="card-content">
              <h5>{users ? users.length : 0} Users</h5>
              <p>Observe all registered users.</p>
            </div>
          </div>

          <div className="card-custom comment-card">
            <FontAwesomeIcon icon={faComments} className="card-icon" />
            <div className="card-content">
              <h5>{comments ? comments.length : 0} Comments</h5>
              <p>Review user comments.</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-section">
            <Chart />
          </div>
        </div>
      </main>

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