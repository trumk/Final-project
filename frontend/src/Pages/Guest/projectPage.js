import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Navbar";
import { useEffect } from "react";
import { getAllProjects } from "../../redux/apiRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import SearchSortFilter from "../../Components/SearchSortFilter";

function Projectpage() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project?.allProjects);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <SearchSortFilter/>
      <main className="project-page">
        <div className="container mt-5">
          <div className="row">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                >
                  <a href={`/project/${project._id}`} className="project-item">
                    {project.images.length > 0 && (
                      <img
                        src={project.images[0]} // URL ảnh từ Firebase
                        alt={`Project ${project.name}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        className="project-image"
                      />
                    )}
                    <div className="project-info">
                      <h5 className="project-name">{project.name}</h5>
                      <p className="project-author">By {project.author}</p>
                      <p className="project-likes">
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="like-icon"
                        />
                        {project.likes}
                      </p>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Projectpage;
