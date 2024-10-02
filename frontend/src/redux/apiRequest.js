import axios from "axios";
import {
  createProjectFailed,
  createProjectStart,
  createProjectSuccess,
  deleteProjectFailed,
  deleteProjectStart,
  deleteProjectSuccess,
  getProjectFailed,
  getProjectsFailed,
  getProjectsStart,
  getProjectsSuccess,
  getProjectStart,
  getProjectSuccess,
  updateProjectFailed,
  updateProjectStart,
  updateProjectSuccess,
} from "./projectSlice";
import { toast } from "react-toastify";
import { getUserFailed, getUsersFailed, getUsersStart, getUsersSuccess, getUserStart, getUserSuccess } from "./userSlice";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";

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
  dispatch(getProjectStart());
  try {
    const response = await axios.get(`${BACKEND_URL}/api/projects/${id}`);
    dispatch(getProjectSuccess(response.data));
  } catch (err) {
    dispatch(getProjectFailed(err.message));
  }
};

export const createProject = (formData, navigate) => async (dispatch) => {
  dispatch(createProjectStart());
  try {
    const response = await axios.post(`${BACKEND_URL}/api/projects`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

export const updateProject =
  (id, projectData, navigate) => async (dispatch) => {
    dispatch(updateProjectStart());
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/projects/${id}`,
        projectData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(updateProjectSuccess(response.data));
      toast.success("Project updated");
      navigate("/admin/project");
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

export const register = async (user, dispatch) => {
  dispatch(registerStart());
  try {
    await axios.post(`${BACKEND_URL}/api/auth/register`, user);
    dispatch(registerSuccess());
    toast.success("Register successfully");
  } catch (err) {
    dispatch(registerFailed());
    console.error(err);
  }
};

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    await axios.post(`${BACKEND_URL}/api/auth/login`, user);
    dispatch(loginSuccess());
    toast.success("Login successfully");
  } catch (err) {
    dispatch(loginFailed());
    console.error(err);
  }
};

export const logout = async (user, dispatch) => {
  dispatch(logoutStart());
  try {
    await axios.post(`${BACKEND_URL}/api/auth/logout`, user);
    dispatch(logoutSuccess());
    toast.success("Logout successfully");
  } catch (err) {
    dispatch(logoutFailed());
    console.error(err);
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await axios.get(`${BACKEND_URL}/api/user/`);
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    console.error(err);
    dispatch(getUsersFailed());
  }
};

export const getOneUser = (id) => async (dispatch) => {
  dispatch(getUserStart());
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/${id}`);
    dispatch(getUserSuccess(response.data));
  } catch (err) {
    dispatch(getUserFailed(err.message));
  }
};

