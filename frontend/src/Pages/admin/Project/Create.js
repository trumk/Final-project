import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../../redux/apiRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('description', description);
  
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
  
    // Kiểm tra dữ liệu gửi đi
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    dispatch(createProject(formData, navigate));
  };
  

  return (
    <div className="container-fluid p-4">
      <button className="btn btn-primary mb-2 me-2">
        <a href='/admin/project' style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>Back</a>
      </button>
      <h1 className="mb-4">Create New Project</h1>
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
          <input
            type="file"
            id="images"
            className="form-control"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
