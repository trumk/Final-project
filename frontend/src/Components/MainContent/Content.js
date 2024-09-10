import React, { useEffect } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects } from '../../redux/apiRequest';

const MainContent = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.allProjects);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

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
              {projects.map((project) => (
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
                    <h5>-{project.author}-</h5>
                    <p>{project.description}</p>
                    <a href={`/projects/${project._id}`} className="btn btn-project">View More</a>
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
