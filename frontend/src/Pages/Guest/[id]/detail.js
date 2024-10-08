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
  const [isLiked, setIsLiked] = useState(false);

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

  return (
    <div className="detail-page">
      <Navbar />
      <div className="content-container">
        {project ? (
          <>
            {/* Main content container */}
            <div className="main-content">
              {/* Section thông tin dự án */}
              <div className="project-details-section">
                <h1 className="project-title">{project.name}</h1>
                {project.images.length > 0 && (
                  <img
                    src={project.images[0]}
                    alt={`Project ${project.name}`}
                    className="project-image"
                  />
                )}
                <p className="project-author">
                  By: {project.authors.join(", ")}
                </p>
                <p className="project-description">{project.description}</p>

                {/* Nút like */}
                <button
                  className={`like-button ${isLiked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  {isLiked ? "Unlike" : "Like"} ({project.likes})
                </button>
              </div>

              {/* Section bình luận giống Facebook */}
              <div className="comments-section">
                <h3>Comments:</h3>

                {/* Form bình luận */}
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="comment-input-container">
                    {currentUser && (
                      <img
                        src={currentUser.avatar || "/default-avatar.png"}
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

                {/* Hiển thị danh sách bình luận */}
                {comments?.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-avatar">
                        <img
                          src={`/imgs/avatar.png`}
                          alt="Avatar"
                          className="user-avatar"
                        />
                      </div>
                      <div className="comment-content">
                        <p className="comment-user-name">
                          {comment.userId?.userName}
                        </p>
                        <p className="comment-text">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>

            {/* Section các dự án liên quan */}
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
