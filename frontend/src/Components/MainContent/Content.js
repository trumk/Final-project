import React, { useEffect, useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "../../redux/apiRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const MainContent = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project?.allProjects || []);
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0) {
      const sortedProjects = [...projects]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);
      setTopProjects(sortedProjects);
    }
  }, [projects]);

  return (
    <section className="top-projects section-padding">
      <div className="container">
        <div className="section-header">
          <h2>Top Projects</h2>
          <p>Explore the most popular projects chosen just for you.</p>
        </div>
        <div className="project-list">
          {topProjects.map((project) => (
            <div key={project._id} className="project-card">
              <img
                src={project.images[0]}
                alt={`Project ${project.name}`}
                className="project-image"
              />
              <div className="project-details">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-authors">{project.authors.join(", ")}</p>
                <div className="project-actions">
                  <span className="project-likes">
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {project.likes}
                  </span>
                  <a href={`/project/${project._id}`} className="btn-project">
                    View Project
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainContent;