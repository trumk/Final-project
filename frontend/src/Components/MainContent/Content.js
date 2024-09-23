import React, { useEffect, useState } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects } from '../../redux/apiRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const MainContent = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project?.allProjects || []); // Default to empty array if undefined or null
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0) {
      const sortedProjects = [...projects].sort((a, b) => b.likes - a.likes).slice(0, 3);
      setTopProjects(sortedProjects);
    }
  }, [projects]);

  return (
    <section className="top-projects section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="section-title">
              <h2>Top Projects</h2>
              <p>Discover our most outstanding projects just for you.</p>
            </div>
            <div className="project-list">
              {topProjects.map((project) => (
                <div key={project._id} className="project-item">
                  {project.images.length > 0 && (
                    <img
                      src={`http://localhost:5000/${project.images[0]}`} 
                      alt={`Project ${project.name}`}
                      className="project-image"
                    />
                  )}
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <h5>- {project.author} -</h5>
                    <div className="project-likes">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      <span>{project.likes}</span>
                    </div>
                    <a href={`/project/${project._id}`} className="btn btn-project">View More</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            {/* Placeholder for custom content */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainContent;
