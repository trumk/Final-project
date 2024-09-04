import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; 
import { getAllProjects } from '../../../redux/apiRequest';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const { allProjects, isFetching, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getAllProjects()); // Không cần truyền dispatch, hàm getAllProjects sẽ tự sử dụng dispatch
  }, [dispatch]);

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4">Project Management</h1>
        
        {isFetching && <p>Loading...</p>}
        {error && <p className="text-danger">Failed to fetch projects</p>}
        
        {!isFetching && !error && (
            <table className="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Author</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {allProjects && allProjects.map((project, index) => (
                <tr key={project._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{project.name}</td>
                    <td>{project.author}</td>
                    <td>{project.description}</td>
                    <td>
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button 
                        className="btn btn-danger btn-sm" 
                        // onClick={() => handleDelete(project._id)}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
    </div>
  );
};

export default ProjectPage;
