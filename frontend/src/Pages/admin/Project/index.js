import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { getAllProjects } from "../../../redux/apiRequest";
// import NavbarAdmin from "../../../Components/NavbarAdmin";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.project.allProjects);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/admin/project/edit/${id}`);
  };

  return (
    <>
      {/* <NavbarAdmin/> */}
      <div className="container-fluid p-4">
        <h1 className="mb-4">Project Management</h1>
        <button className="btn btn-primary mb-2 me-2">
          <a
            href="/admin/project/create"
            style={{
              color: "black",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Add new project
          </a>
        </button>
        {projects?.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Author</th>
                <th scope="col">Description</th>
                <th scope="col">Created At</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {project.images.length > 0 && (
                      <img
                        src={project.images[0]} // URL ảnh từ Firebase
                        alt={`Project ${project.name}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td>

                  <td>{project.name}</td>
                  <td>{project.authors}</td>
                  <td>{project.description}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm "
                      onClick={() => handleEdit(project._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects available.</p>
        )}
      </div>
    </>
  );
};

export default ProjectPage;
