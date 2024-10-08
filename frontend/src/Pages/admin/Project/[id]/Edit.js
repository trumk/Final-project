import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { deleteProject, getProject, updateProject } from "../../../../redux/apiRequest";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css"; 
import ReactQuill from "react-quill"; 

const EditProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const project = useSelector((state) => state.project?.currentProject);

  const [name, setName] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState(""); // Sử dụng react-quill cho phần mô tả
  const [semester, setSemester] = useState("Spring");
  const [department, setDepartment] = useState("IT");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState(new Set());

  useEffect(() => {
    dispatch(getProject(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setAuthors(project.authors);
      setDescription(project.description);
      setSemester(project.semester || "Spring");
      setDepartment(project.department || "IT");
      setVideoUrl(project.video || "");
      setImages(project.images);
    }
  }, [project]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filePreviews = files.map((file) => {
      return {
        file: file,
        preview: URL.createObjectURL(file),
      };
    });
    setNewImages((prevImages) => [...prevImages, ...filePreviews]);
  };

  const handleVideoFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages((prevImages) => prevImages.filter((image) => image !== imageToRemove));
    setRemovedImages((prevRemovedImages) => {
      const updatedSet = new Set(prevRemovedImages);
      updatedSet.add(imageToRemove);
      return updatedSet;
    });
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("authors", authors);
    formData.append("description", description);
    formData.append("semester", semester);
    formData.append("department", department);
    if (videoFile) {
      formData.append("video", videoFile);
    } else if (videoUrl) {
      formData.append("video", videoUrl);
    }

    newImages.forEach((file) => {
      formData.append("images", file.file);
    });
    formData.append("removedImages", JSON.stringify([...removedImages]));

    dispatch(updateProject(id, formData, navigate));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id))
        .then(() => {
          navigate("/admin/project");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="container-fluid p-4">
      <button className="btn btn-primary mt-2 mb-2 me-2">
        <a
          href="/admin/project"
          style={{
            color: "black",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Back
        </a>
      </button>
      <h1 className="mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
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
          <label htmlFor="authors" className="form-label">
            Authors
          </label>
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
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="form-control"
            theme="snow"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label">
            Semester
          </label>
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
          <label htmlFor="department" className="form-label">
            Department
          </label>
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
          <label htmlFor="videoUrl" className="form-label">
            Video URL (Optional)
          </label>
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
          <label htmlFor="videoFile" className="form-label">
            Upload Video (Optional)
          </label>
          <input
            type="file"
            id="videoFile"
            className="form-control"
            onChange={handleVideoFileChange}
            accept="video/*"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Images
          </label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={image}
                  alt={`image-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image)}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
              </div>
            ))}
            {newImages.map((image, index) => (
              <div
                key={`new-${index}`}
                style={{
                  position: "relative",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={image.preview}
                  alt={`new-image-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
              </div>
            ))}

            <label
              htmlFor="newImages"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100px",
                height: "100px",
                border: "1px solid #ddd",
                cursor: "pointer",
                backgroundColor: "#f8f9fa",
              }}
            >
              <input
                type="file"
                id="newImages"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <span style={{ color: "#6c757d" }}>Upload more</span>
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Update Project
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditProject;
