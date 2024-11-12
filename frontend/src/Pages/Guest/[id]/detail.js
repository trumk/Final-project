import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProject,
  addComment,
  likeProject,
  getCommentsByProject,
  getAllProjects,
  deleteComment,
} from "../../../redux/apiRequest";
import { faThumbsUp, faEye } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import AIChat from "../../../Components/AiChat";
import LoginModal from "../../../Components/LoginModal/LoginModal";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow } from "date-fns";

const getFileNameFromUrl = (url) => {
  return url.split('/').pop().split('?')[0];
};

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.currentProject);
  const allProjects = useSelector((state) => state.project.allProjects);
  const comments = useSelector((state) => state.project.comments);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [openReplies, setOpenReplies] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const bannedWords = ["fuck", "nigga", "idiot", "shit", "bitch"]; 

  const containsBannedWords = (text) => {
    const words = text.split(" ");
    return words.some((word) => bannedWords.includes(word.toLowerCase()));
  };

  const WarningModal = ({ message, onClose }) => (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Warning</h3>
        <p>{message}</p>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (currentUser) {
      dispatch(getProject(id, currentUser.id)).then(() => {
        dispatch(getCommentsByProject(id));
      });
    } else {
      dispatch(getProject(id)).then(() => {
        dispatch(getCommentsByProject(id));
      });
    }

    if (!allProjects) {
      dispatch(getAllProjects());
    }
  }, [dispatch, id, allProjects, currentUser]);

  useEffect(() => {
    if (project && currentUser) {
      setIsLiked(project.likedUsers?.includes(currentUser.id));
    }
  }, [project, currentUser]);

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const relatedProjects = useMemo(() => {
    if (allProjects && project) {
      return allProjects.filter(
        (p) => p._id !== project._id && p.department === project.department
      );
    }
    return [];
  }, [allProjects, project]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsModalOpen(true);
      return;
    }
    if (containsBannedWords(commentText)) {
      setWarningMessage("Your comment contains inappropriate words.");
      setIsWarningModalOpen(true);
      return;
    }
    const commentData = {
      userId: currentUser.id,
      comment: commentText,
    };
    dispatch(addComment(id, commentData)).then(() => {
      dispatch(getCommentsByProject(id));
    });
    setCommentText("");
  };

  const handleReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!currentUser) {
      setIsModalOpen(true);
      return;
    }
    const replyData = {
      userId: currentUser.id,
      comment: replyText,
      parentId,
    };
    dispatch(addComment(id, replyData)).then(() => {
      dispatch(getCommentsByProject(id));
    });
    setReplyText("");
    setReplyingTo(null);
  };

  const handleDeleteComment = () => {
    if (!currentUser || !commentToDelete) {
      setIsModalOpen(true);
      return;
    }
    dispatch(deleteComment(commentToDelete, currentUser.id)).then(() => {
      dispatch(getCommentsByProject(id));
      setCommentToDelete(null);
    });
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleLike = () => {
    if (!currentUser) {
      setIsModalOpen(true);
      return;
    }
    const likeData = {
      userId: currentUser.id,
    };
    dispatch(likeProject(id, likeData)).then(() => {
      dispatch(getProject(id));
    });
    setIsLiked(!isLiked);
  };

  const handleMaterialClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };  

  const handleMediaSelect = (index, isVideo = false) => {
    setSelectedIndex(index);
    setIsVideoSelected(isVideo);
  };

  const renderComments = (parentId = null, parentUserName = "", depth = 0) => {
    const maxDepth = 2; 

    return comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((comment) => {
        const hasReplies = comments.some((c) => c.parentId === comment._id);
        const currentDepth = Math.min(depth, maxDepth);
        const marginLeft = currentDepth < maxDepth ? `${50 * currentDepth}px` : '0px';
        return (
          <div
            key={comment._id}
            className={parentId ? "reply-item" : "comment-item"}
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: `calc(100% - ${marginLeft})`,
              marginLeft,
            }}
          >
            <div className="comment-header">
              <img
                src={comment.userId?.avatar}
                alt="Avatar"
                className="user-avatar"
              />
              <div className="comment-body">
                <div className="comment-info">
                  <span className="comment-user-name">
                    {comment.userId?.userName}
                  </span>
                  <span className="comment-time">
                    ·{" "}
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="comment-text">
                  {parentId && <strong>@{parentUserName}</strong>}{" "}
                  {comment.comment}
                </p>
                <div className="comment-actions">
                  <button
                    className="reply-button"
                    onClick={() => handleReplyClick(comment._id)}
                  >
                    Reply
                  </button>
                  {currentUser && comment.userId._id === currentUser.id && (
                    <button
                      className="delete-button"
                      onClick={() => confirmDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {hasReplies && !openReplies[comment._id] && (
              <div
                className="view-replies"
                onClick={() => toggleReplies(comment._id)}
              >
                View all{" "}
                {comments.filter((c) => c.parentId === comment._id).length}{" "}
                replies
              </div>
            )}

            {openReplies[comment._id] && (
              <div className="replies">
                {renderComments(
                  comment._id,
                  comment.userId?.userName,
                  depth + 1
                )}
              </div>
            )}

            {replyingTo === comment._id && (
              <form
                onSubmit={(e) => handleReplySubmit(e, comment._id)}
                className="reply-form"
              >
                <textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                  className="reply-input"
                />
                <button type="submit" className="reply-submit-button">
                  Submit Reply
                </button>
              </form>
            )}
          </div>
        );
      });
  };

  const videoId = project?.video
    ? project.video.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)?.[1]
    : null;
  const videoThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="detail-page">
      <Navbar />
      <div className="content-container">
        {project ? (
          <>
            <div className="main-content">
              <div className="project-details-section">
                <h1 className="project-title">{project.name}</h1>
                <div className="project-views">
                  <FontAwesomeIcon icon={faEye} className="icon" />
                  <span> {project.views} view(s)</span>
                </div>
                <div className="media-container">
                  {!isVideoSelected && project.images.length > 0 && (
                    <img
                      src={project.images[selectedIndex]}
                      alt={`Project ${project.name}`}
                      className="project-image"
                    />
                  )}
                  {isVideoSelected && project.video && (
                    <div className="project-image">
                      <iframe
                        width="600"
                        height="380"
                        src={project.video}
                        title="Project Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <div className="image-previews">
                    {project.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index}`}
                        className={`preview-image ${
                          selectedIndex === index && !isVideoSelected
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleMediaSelect(index)}
                      />
                    ))}
                    {project.video && videoThumbnail && (
                      <img
                        src={videoThumbnail}
                        alt="Video preview"
                        className={`preview-image ${
                          isVideoSelected ? "active" : ""
                        }`}
                        onClick={() => handleMediaSelect(null, true)}
                      />
                    )}
                  </div>
                </div>

                <p className="project-author">
                  By: {project.authors.join(", ")}
                </p>
                <div
                  className="project-description"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
                {project.reports && project.reports.length > 0 && (
                  <div className="project-reports">
                    <h5>Project Materials:</h5>
                    <ul>
                      {project.reports.map((report, index) => (
                        <li key={index}>
                          <a
                            href={report}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleMaterialClick}
                          >
                            {getFileNameFromUrl(report)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className={`like-button ${isLiked ? "liked" : ""} mt-1`}
                  onClick={handleLike}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> ({project.likes})
                </button>
              </div>

              <div className="comment-section-container">
                {commentToDelete && (
                  <div className="delete-confirmation-modal">
                    <p>Are you sure you want to delete this comment?</p>
                    <button
                      onClick={handleDeleteComment}
                      className="confirm-delete-button"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setCommentToDelete(null)}
                      className="cancel-delete-button"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <h3>Comments:</h3>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="comment-input-container">
                    {currentUser && (
                      <img
                        src={currentUser?.avatar}
                        alt="Avatar"
                        className="user-avatar"
                      />
                    )}
                    <textarea
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      className="comment-input"
                    />
                  </div>
                  <button type="submit" className="comment-submit-button">
                    Comment
                  </button>
                </form>

                {comments.length > 0 ? (
                  <div>{renderComments()}</div>
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="loading-message">Loading project details...</p>
        )}
      </div>

      <div className="related-projects-section">
        <h3>Related Projects</h3>
        <div className="related-projects-list">
          {relatedProjects.length > 0 ? (
            relatedProjects.map((relatedProject) => (
              <div key={relatedProject._id} className="related-project-card">
                <a href={`/project/${relatedProject._id}`}>
                  {relatedProject.images.length > 0 && (
                    <img
                      src={relatedProject.images[0]}
                      alt={`Project ${relatedProject.name}`}
                      className="related-project-image"
                    />
                  )}
                  <h4>{relatedProject.name}</h4>
                  <p>By: {relatedProject.authors.join(", ")}</p>
                </a>
              </div>
            ))
          ) : (
            <p>No related projects found.</p>
          )}
        </div>
      </div>

      {isWarningModalOpen && (
        <WarningModal
          message={warningMessage}
          onClose={() => setIsWarningModalOpen(false)}
        />
      )}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AIChat />
      <Footer />
    </div>
  );
}

export default DetailPage;