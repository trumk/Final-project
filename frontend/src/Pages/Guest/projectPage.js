import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Navbar";
import AIChat from "../../Components/AiChat";
import { useEffect } from "react";
import { getAllProjects } from "../../redux/apiRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faCommentAlt,
  faShare,
  faEye, // Import icon for views
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import SearchSortFilter from "../../Components/SearchSortFilter";

function Projectpage() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project?.allProjects);
  const [showShareModal, setShowShareModal] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleCopyLink = (projectId) => {
    const url = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareClick = (e, projectId) => {
    e.stopPropagation();
    e.preventDefault();
    setShowShareModal(showShareModal === projectId ? null : projectId);
  };

  return (
    <div>
      <Navbar />
      <SearchSortFilter />
      <main className="project-page">
        <div className="container mt-5">
          <div className="row">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="col-12 mb-4">
                  <div className="project-card">
                    <a
                      href={`/project/${project._id}`}
                      className="project-item"
                    >
                      {project.images.length > 0 && (
                        <img
                          src={project.images[0]}
                          alt={`Project ${project.name}`}
                          className="project-image"
                        />
                      )}
                      <div className="project-info">
                        <h5 className="project-name">{project.name}</h5>
                        <p className="project-author">By {project.authors.join(', ')}</p>
                        <div className="project-actions">
                          <div className="action-buttons">
                            <button className="btn btn-link">
                              <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="icon"
                              />
                              <span>{project.likes}</span>
                            </button>
                            <button className="btn btn-link">
                              <FontAwesomeIcon
                                icon={faCommentAlt}
                                className="icon"
                              />
                              <span>Comment</span>
                            </button>
                            <div className="share-button-wrapper">
                              <button
                                className="btn btn-link"
                                onClick={(e) =>
                                  handleShareClick(e, project._id)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faShare}
                                  className="icon"
                                />
                                <span>Share</span>
                              </button>
                              {showShareModal === project._id && (
                                <div className="share-modal">
                                  <p>Copy link to project:</p>
                                  <input
                                    type="text"
                                    value={`${window.location.origin}/project/${project._id}`}
                                    readOnly
                                    className="share-link"
                                  />
                                  <button
                                    onClick={() => handleCopyLink(project._id)}
                                    className="copy-btn"
                                  >
                                    {copied ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="view-count">
                            <FontAwesomeIcon icon={faEye} className="icon" />
                            <span> {project.views} view(s)</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        </div>
      </main>
      <AIChat />
      <Footer />
    </div>
  );
}

export default Projectpage;