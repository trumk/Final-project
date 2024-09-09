import axios from 'axios'
import { createProjectFailed, createProjectStart, createProjectSuccess, deleteProjectFailed, deleteProjectStart, deleteProjectSuccess, getProjectFailed, getProjectsFailed, getProjectsStart, getProjectsSuccess, getProjectStart, getProjectSuccess, updateProjectFailed, updateProjectStart, updateProjectSuccess } from './projectSlice';
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:5000";


export const getAllProjects = () => async (dispatch) => { 
    dispatch(getProjectsStart());
  try {
    const res = await axios.get(`${BACKEND_URL}/api/projects`);
    dispatch(getProjectsSuccess(res.data));
  } catch (err) {
    console.error(err); 
    dispatch(getProjectsFailed());
  }
};

export const getProject = (id) => async (dispatch) => {
    dispatch(getProjectStart())
    try {
      const response = await axios.get(`${BACKEND_URL}/api/projects/${id}`);
      dispatch(getProjectSuccess(response.data));
    } catch (err) {
      dispatch(getProjectFailed(err.message));
    }
  };

  export const createProject = (projectData, navigate) => async (dispatch) => {
    dispatch(createProjectStart());
    try {
      const formData = new FormData();
      formData.append('name', projectData.name);
      formData.append('author', projectData.author);
      formData.append('description', projectData.description);
  
      // Gửi nhiều ảnh qua FormData
      projectData.images.forEach((image) => {
        formData.append('images', image);
      });
  
      const response = await axios.post(`${BACKEND_URL}/api/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch(createProjectSuccess(response.data));
      toast.success("Add new project success");
      navigate("/admin/project");
    } catch (err) {
      dispatch(createProjectFailed(err.message));
      toast.error("Failed to add new project: " + err.message);
    }
  };
  

  export const updateProject = (id, projectData, navigate) => async (dispatch) => {
    dispatch(updateProjectStart());
    try {
      const response = await axios.put(`${BACKEND_URL}/api/projects/${id}`, projectData);
      dispatch(updateProjectSuccess(response.data));
      toast.success("Project updated");
      navigate('/admin/project');
    } catch (err) {
      dispatch(updateProjectFailed(err.message));
    }
  };
  
  export const deleteProject = (id) => async (dispatch) => {
    dispatch(deleteProjectStart());
    try {
      await axios.delete(`${BACKEND_URL}/api/projects/${id}`);
      dispatch(deleteProjectSuccess(id));
      alert(`Project with id ${id} is deleted`); 
    } catch (err) {
      dispatch(deleteProjectFailed(err.message));
    }
  };

 
