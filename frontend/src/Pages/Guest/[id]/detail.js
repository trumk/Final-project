import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProject, addComment, likeProject } from "../../../redux/apiRequest";
import { useParams } from "react-router-dom";
import "./style.css";

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.currentProject);
  const currentUser = useSelector((state) => state.auth.currentUser); // Lấy thông tin người dùng hiện tại

  const [commentText, setCommentText] = useState(""); // Quản lý trạng thái text của bình luận
  const [isLiked, setIsLiked] = useState(false); // Trạng thái cho việc thích dự án

  // Lấy chi tiết dự án
  useEffect(() => {
    dispatch(getProject(id));
  }, [dispatch, id]);

  // Cập nhật trạng thái isLiked khi dự án được tải về
  useEffect(() => {
    if (project && currentUser) {
      setIsLiked(project.likedUsers.includes(currentUser.id));
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

    const idToken = currentUser.idToken || null; // Kiểm tra xem có token Firebase không

    dispatch(addComment(id, commentData, idToken)); // Gửi bình luận đến server
    setCommentText(""); // Reset input
  };

  // Xử lý like dự án
  const handleLike = () => {
    if (!currentUser) {
      alert("You need to login to like.");
      return;
    }

    const idToken = currentUser.idToken || null; // Kiểm tra xem có token Firebase không

    dispatch(likeProject(id, idToken)); // Gửi yêu cầu like đến server
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
            <button className={`like-button ${isLiked ? "liked" : ""}`} onClick={handleLike}>
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
            {project.comments?.length > 0 ? (
              <div className="comments-section">
                <h3>Comments:</h3>
                {project.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <p><strong>{comment.userId.userName}:</strong> {comment.comment}</p>
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
