import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getProject,
  addComment,
  likeProject,
  getCommentsByProject,
} from "../../../redux/apiRequest";
import { useParams } from "react-router-dom";
import "./style.css";

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.currentProject);
  const comments = useSelector((state) => state.project.comments);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dispatch(getProject(id)).then(() => {
      dispatch(getCommentsByProject(id));
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (project && currentUser) {
      setIsLiked(project.likedUsers?.includes(currentUser.id));
    }
  }, [project, currentUser]);

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

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const renderComments = (parentId = null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="comment-avatar">
            <img
              src={`/imgs/avatar.png`}
              alt="Avatar"
              className="user-avatar"
            />
          </div>
          <div className="comment-content">
            <p className="comment-user-name">{comment.userId?.userName}</p>
            <p className="comment-text">{comment.comment}</p>

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

            {/* Recursively render replies */}
            <div className="reply-container">{renderComments(comment._id)}</div>
          </div>
        </div>
      ));
  };

  return (
    <div className="detail-page">
      <Navbar />
      <div className="content-container">
        {project ? (
          <>
            <div className="main-content">
              <div className="project-details-section">
                <h1 className="project-title">{project.name}</h1>

                {project.images.length > 0 && (
                  <>
                    <img
                      src={project.images[selectedImageIndex]}
                      alt={`Project ${project.name}`}
                      className="project-image"
                    />

                    <div className="image-previews">
                      {project.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Preview ${index}`}
                          className={`preview-image ${
                            selectedImageIndex === index ? "active" : ""
                          }`}
                          onClick={() => handleImageSelect(index)}
                        />
                      ))}
                    </div>
                  </>
                )}

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
                  {isLiked ? "Unlike" : "Like"} ({project.likes})
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

                {/* Render comments and replies */}
                {comments.length > 0 ? (
                  <div>{renderComments()}</div>
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>

            <div className="related-projects-section">
              <h3>Related Projects:</h3>
              <p>Coming soon...</p>
            </div>
          </>
        ) : (
          <p className="loading-message">Loading project details...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DetailPage;
