import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProject } from "../../../redux/apiRequest";
import { useParams } from "react-router-dom";
import "./style.css";

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.currentProject);

  useEffect(() => {
    dispatch(getProject(id));
  }, [dispatch, id]);

  return (
    <div className="detail-page">
      <Navbar />

      {project ? (
        <div className="container">
          <div className="project-details">
            <h1 className="project-title">{project.name}</h1>
            {project.images.length > 0 && (
              <img
                src={`http://localhost:5000/${project.images[0]}`}
                alt={`Project ${project.name}`}
                className="project-image"
              />
            )}
            <p className="project-author">By: {project.author}</p>
            <p className="project-description">{project.description}</p>
          </div>
        </div>
      ) : (
        <p className="loading-message">Loading project details...</p> // Hiển thị khi đang tải
      )}

      <Footer />
    </div>
  );
}

export default DetailPage;
