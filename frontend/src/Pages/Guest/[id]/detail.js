import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProject,
  addComment,
  likeProject,
  getCommentsByProject,
  getAllProjects,
} from "../../../redux/apiRequest";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  useEffect(() => {
    dispatch(getProject(id)).then(() => {
      dispatch(getCommentsByProject(id));
    });

    if (!allProjects) {
      dispatch(getAllProjects());
    }
  }, [dispatch, id, allProjects]);

  useEffect(() => {
    if (project && currentUser) {
      setIsLiked(project.likedUsers?.includes(currentUser.id));
    }
  }, [project, currentUser]);

  const relatedProjects = useMemo(() => {
    if (allProjects && project) {
      const filteredProjects = allProjects.filter(
        (p) => p._id !== project._id && p.department === project.department
      );
      return filteredProjects;
    }
    return [];
  }, [allProjects, project]);
  console.log("Related Projects to Render:", relatedProjects);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You need to login to comment.");
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
      alert("You need to login to reply.");
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

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleLike = () => {
    if (!currentUser) {
      alert("You need to login to like.");
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

  const handleMediaSelect = (index, isVideo = false) => {
    setSelectedIndex(index);
    setIsVideoSelected(isVideo);
  };

  const extractVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const renderComments = (parentId = null, parentUserName = "") => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment._id} className={parentId ? "reply-item" : "comment-item"}>
          <div className={parentId ? "reply-avatar" : "comment-avatar"}>
            <img
              src={`/imgs/avatar.png`}
              alt="Avatar"
              className="user-avatar"
            />
          </div>
          <div className={parentId ? "reply-content" : "comment-content"}>
            <p className={parentId ? "reply-user-name" : "comment-user-name"}>
              {comment.userId?.userName}
            </p>
            <p className={parentId ? "reply-text" : "comment-text"}>
              {parentId && <strong>@{parentUserName}</strong>} {comment.comment}
            </p>
  
            <button
              className="reply-button"
              onClick={() => handleReplyClick(comment._id)}
            >
              Reply
            </button>
  
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
  
            <div className="">
              {renderComments(comment._id, comment.userId?.userName)}
            </div>
          </div>
        </div>
      ));
  };
  

  const videoId = project?.video ? extractVideoId(project.video) : null;
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
                <div className="media-container">
                  {!isVideoSelected && project.images.length > 0 && (
                    <img
                      src={project.images[selectedIndex]}
                      alt={`Project ${project.name}`}
                      className="project-image"
                    />
                  )}
                  {isVideoSelected && project.video && (
                    <div className="project-image" style={{}}>
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
                <button
                  className={`like-button ${isLiked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> ({project.likes})
                </button>
              </div>

              <div className="comments-section">
                <h3>Comments:</h3>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="comment-input-container">
                    {currentUser && (
                      <img
                        src={`/imgs/avatar.png`}
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
          {relatedProjects && relatedProjects.length > 0 ? (
            relatedProjects.map((relatedProject) => {
              return (
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
              );
            })
          ) : (
            <p>No related projects found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DetailPage;
