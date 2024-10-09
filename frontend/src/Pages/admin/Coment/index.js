import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllComments } from "../../../redux/apiRequest"; 

const CommentPage = () => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.project?.comments);

  useEffect(() => {
    dispatch(getAllComments()); 
  }, [dispatch]);

  return (
    <div className="container-fluid p-4">
    <button className="btn btn-primary mb-2 me-2">
      <a href="/admin" style={{ color: "white", fontSize: 20, textDecoration: "none" }}>Back</a>
    </button>
    <h1 className="mb-4">Comments</h1>
    {comments?.length > 0 ? (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Username</th>
            <th scope="col">Comment</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={comment._id}>
              <th scope="row">{index + 1}</th>
              <td>{comment.userId?.userName}</td> 
              <td>{comment.comment}</td> 
              <td>{new Date(comment.createdAt).toLocaleString()}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No comments available.</p> 
    )}
  </div>
  );
};

export default CommentPage;
