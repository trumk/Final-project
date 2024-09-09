import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteProject, getProject, updateProject } from '../../../../redux/apiRequest'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const project = useSelector((state) => state.project.currentProject);

  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(getProject(id)); 
  }, [dispatch, id]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setAuthor(project.author);
      setDescription(project.description);
      setImages(project.images);
    }
  }, [project]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedProject = {
      name,
      author,
      description,
      images
    };
    dispatch(updateProject(id, updatedProject, navigate));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id))
        .then(() => {
          navigate('/admin/project'); 
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="container-fluid p-4">
      <button className="btn btn-primary mb-2 me-2">
        <a href='/admin/project' style={{color: 'black', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px'}}>Back</a>
      </button>
      <h1 className="mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            id="author"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <div>
            {images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${image}`}
                alt={``}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  marginRight: '5px',
                  marginBottom: '5px'
                }}
              />
            ))}
          </div>
          <input
            type="text"
            id="images"
            className="form-control mt-2"
            value={images.join(',')}
            onChange={(e) => setImages(e.target.value.split(','))}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Update Project</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
};

export default EditProject;
