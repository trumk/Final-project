import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllUsers } from "../../../redux/apiRequest"; 

const UserPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user?.allUsers); 

  useEffect(() => {
    dispatch(getAllUsers()); 
  }, [dispatch]);

  return (
    <div className="container-fluid p-4">
      <button className="btn btn-primary mb-2 me-2">
          <a href="/admin" style={{color:"white", fontSize: 20, textDecoration:"none"}}>Back</a>
      </button>  
      <h1 className="mb-4">Users</h1>
      {users?.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th scope="row">{index + 1}</th>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users available.</p> 
      )}
    </div>
  );
};

export default UserPage;
