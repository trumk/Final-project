import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../../redux/apiRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';  // Import CSS của React Quill
import ReactQuill from 'react-quill';  // Import React Quill
import './style.css';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [authors, setAuthors] = useState('');
  const [description, setDescription] = useState('');  
  const [semester, setSemester] = useState('Spring'); 
  const [department, setDepartment] = useState('IT');  
  const [videoUrl, setVideoUrl] = useState(''); 
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('authors', authors);
    formData.append('description', description);  
    formData.append('semester', semester);
    formData.append('department', department);

    if (videoUrl) {
      formData.append('video', videoUrl);
    }
    
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
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
          <label htmlFor="authors" className="form-label">Authors</label>
          <input
            type="text"
            id="authors"
            className="form-control"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Enter project description..."
            className="form-control"
            theme="snow"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label">Semester</label>
          <select
            id="semester"
            className="form-control"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">Department</label>
          <select
            id="department"
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="videoUrl" className="form-label">Video URL (Optional)</label>
          <input
            type="url"
            id="videoUrl"
            className="form-control"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
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
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
