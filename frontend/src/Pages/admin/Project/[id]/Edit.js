import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteProject,
  getProject,
  updateProject,
} from "../../../../redux/apiRequest";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const project = useSelector((state) => state.project.currentProject);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState(new Set()); // Sử dụng Set để theo dõi ảnh đã xóa

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

  console.log(project.images)
  console.log(newImages)
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filePreviews = files.map((file) => {
      return {
        file: file, // File object
        preview: URL.createObjectURL(file), // Tạo URL để xem trước ảnh
      };
    });

    setNewImages((prevImages) => [...prevImages, ...filePreviews]);
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (image) => image !== imageToRemove
      );
      return updatedImages;
    });

    // Thêm ảnh đã xóa vào Set
    setRemovedImages((prevRemovedImages) =>
      new Set(prevRemovedImages).add(imageToRemove)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("likes", "");

    // Thêm ảnh mới vào FormData
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    // Thêm ảnh đã xóa vào FormData
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
          <label htmlFor="author" className="form-label">
            Author
          </label>
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
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Images
          </label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* Hiển thị ảnh cũ */}
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
                  src={`http://localhost:5000/${image}`}
                  alt={`image-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
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

            {/* Hiển thị ảnh mới được chọn */}
            {newImages.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={image.preview} // URL xem trước
                  alt={`new-image-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
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
