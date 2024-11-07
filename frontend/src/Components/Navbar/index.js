import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/apiRequest";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../../redux/apiRequest";
import { markAsRead } from "../../redux/userSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const notifications = useSelector((state) => state.user.notifications);
  const unreadCount = useSelector((state) => state.user.unreadCount);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (currentUser) {
      dispatch(getNotifications(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const handleLogoutConfirm = async () => {
    try {
      if (currentUser) {
        await logout(dispatch, currentUser.id);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const closeModal = () => {
    setShowLogoutModal(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && currentUser) {
      dispatch(markAsRead());
      dispatch(markNotificationsAsRead(currentUser.id));
    }
  };

  return (
    <>
      <header className="header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="/">
              gree <span>Project</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav left-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects">
                    Project
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav right-nav">
                {currentUser && (
                  <li className="nav-item position-relative">
                    {/* Notification Bell with count */}
                    <button
                      className="nav-link"
                      onClick={handleNotificationClick}
                    >
                      <FontAwesomeIcon icon={faBell} />
                      {unreadCount > 0 && (
                        <span className="notification-count">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <ul className="notification-dropdown">
                        {notifications?.length > 0 ? (
                          notifications.map((notif, index) => (
                            <li key={index} className="notification-item">
                              <p>
                               {notif.message}
                              </p>{" "}
                              {/* Đảm bảo message hiển thị đúng */}
                            </li>
                          ))
                        ) : (
                          <li className="notification-item">
                            No new notifications
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                )}
                {currentUser ? (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {currentUser.userName}
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/profile/${currentUser.id}`}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogoutClick}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Modal to confirm logout */}
      {showLogoutModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-logout" onClick={handleLogoutConfirm}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;