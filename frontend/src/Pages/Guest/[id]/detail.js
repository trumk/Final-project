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
  const currentUser = useSelector((state) => state.auth.currentUser); // Lấy thông tin người dùng hiện tại

  const [commentText, setCommentText] = useState(""); // Quản lý trạng thái text của bình luận
  const [isLiked, setIsLiked] = useState(false); // Trạng thái cho việc thích dự án

  // Lấy chi tiết dự án và bình luận
  useEffect(() => {
    dispatch(getProject(id)).then(() => {
      dispatch(getCommentsByProject(id));
    });
  }, [dispatch, id]);

  // Cập nhật trạng thái isLiked khi dự án được tải về
  useEffect(() => {
    if (project && currentUser) {
      setIsLiked(project.likedUsers?.includes(currentUser.id));
    }
  }, [project, currentUser]);

  // Xử lý gửi bình luận
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
      dispatch(getCommentsByProject(id)); // Tải lại bình luận sau khi thêm bình luận thành công
    });

    setCommentText(""); // Reset input
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
      dispatch(getProject(id)); // Tải lại thông tin dự án sau khi like/unlike thành công
    });
    setIsLiked(!isLiked); // Thay đổi trạng thái liked
  };

  return (
    <div className="detail-page">
      <Navbar />

      {project ? (
        <div className="container">
          <div className="project-details">
            <h1 className="project-title">{project.name}</h1>
            {project.images.length > 0 && (
              <img
                src={project.images[0]}
                alt={`Project ${project.name}`}
                className="project-image"
              />
            )}
            <p className="project-author">By: {project.authors.join(", ")}</p>
            <p className="project-description">{project.description}</p>

            {/* Nút like */}
            <button
              className={`like-button ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
            >
              {isLiked ? "Unlike" : "Like"} ({project.likes})
            </button>

            {/* Form bình luận */}
            <form onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button type="submit">Comment</button>
            </form>

            {/* Hiển thị bình luận */}
            {comments?.length > 0 ? (
              <div className="comments-section">
                <h3>Comments:</h3>
                {comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <p>
                      <strong>{comment?.userId?.userName}:</strong>{" "}
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      ) : (
        <p className="loading-message">Loading project details...</p>
      )}

      <Footer />
    </div>
  );
}

export default DetailPage;
