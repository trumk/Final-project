import axios from "axios";
import {
  addCommentFailed,
  addCommentStart,
  addCommentSuccess,
  createProjectFailed,
  createProjectStart,
  createProjectSuccess,
  deleteProjectFailed,
  deleteProjectStart,
  deleteProjectSuccess,
  filterProjectsFailed,
  filterProjectsStart,
  filterProjectsSuccess,
  getAllCommentsFailed,
  getAllCommentsStart,
  getAllCommentsSuccess,
  getCommentsFailed,
  getCommentsStart,
  getCommentsSuccess,
  getNotificationsFailed,
  getNotificationsStart,
  getNotificationsSuccess,
  getProjectFailed,
  getProjectsFailed,
  getProjectsStart,
  getProjectsSuccess,
  getProjectStart,
  getProjectSuccess,
  likeProjectFailed,
  likeProjectStart,
  likeProjectSuccess,
  markAsRead,
  searchProjectsFailed,
  searchProjectsStart,
  searchProjectsSuccess,
  sortProjectsFailed,
  sortProjectsStart,
  sortProjectsSuccess,
  updateProjectFailed,
  updateProjectStart,
  updateProjectSuccess,
} from "./projectSlice";
import { toast } from "react-toastify";
import { getUserFailed, getUsersFailed, getUsersStart, getUsersSuccess, getUserStart, getUserSuccess, updateUserFailed, updateUserStart, updateUserSuccess } from "./userSlice";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { aiRequestFailed, aiRequestStart, aiRequestSuccess } from "./aiSlice";

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

export const login = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/login`, user);
    
    if (res.data && res.data.user) {
      console.log("User role:", res.data.user.role); 
      dispatch(loginSuccess(res.data.user));
      
      if (res.data.user.role === 'admin') {
        setTimeout(() => {
          navigate('/admin');
        }, 30);  
      } else {
        setTimeout(() => {
          navigate('/');
        }, 30);  
      }
      toast.success("Login successfully");
    } else {
      throw new Error("No user data returned");
    }
  } catch (err) {
    dispatch(loginFailed(err.message || "Failed to login"));
    console.error(err);
  }
};

export const loginWithProvider = async (email, providerId, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/loginWithProvider`, { email, providerId });

    if (res.data.user) {
      dispatch(loginSuccess(res.data.user)); 
      navigate('/'); 
    }
  } catch (error) {
    dispatch(loginFailed(error.message || "Failed to login with provider"));
    console.error("Login with provider failed:", error);
  }
};

export const logout = async (dispatch) => {
  dispatch(logoutStart());
  try {
    await axios.post(`${BACKEND_URL}/api/auth/logout`); 
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

export const getCommentsByProject = (projectId) => async (dispatch) => {
  dispatch(getCommentsStart());
  try {
    const res = await axios.get(`${BACKEND_URL}/api/projects/${projectId}/comments`);
    dispatch(getCommentsSuccess(res.data));
  } catch (error) {
    dispatch(getCommentsFailed(error.message));
  }
};

export const getAllComments = () => async (dispatch) => {
  dispatch(getAllCommentsStart()); 
  try {
    const res = await axios.get(`${BACKEND_URL}/api/projects/comments`);
    if (res.data) {
      dispatch(getAllCommentsSuccess(res.data)); 
    } else {
      throw new Error("No comments found");
    }
  } catch (error) {
    dispatch(getAllCommentsFailed(error.response?.data?.message || error.message || "Failed to fetch comments"));
  }
};

export const addComment = (projectId, commentData) => async (dispatch) => {
  dispatch(addCommentStart());
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/projects/${projectId}/comments`,
      commentData
    );
    dispatch(addCommentSuccess(res.data));
  } catch (error) {
    dispatch(addCommentFailed(error.message));
  }
};

export const likeProject = (projectId, likeData) => async (dispatch) => {
  dispatch(likeProjectStart());
  try {
    await axios.post(`${BACKEND_URL}/api/projects/${projectId}/like`, likeData);
    dispatch(likeProjectSuccess());
  } catch (error) {
    dispatch(likeProjectFailed(error.message));
  }
};


export const getNotifications = async (dispatch) => {
  dispatch(getNotificationsStart());
  try {
    const res = await axios.get(`${BACKEND_URL}/api/notifications`);
    dispatch(getNotificationsSuccess(res.data));
  } catch (error) {
    dispatch(getNotificationsFailed(error.message));
  }
};

export const markNotificationsAsRead = async (dispatch) => {
  try {
    await axios.put(`${BACKEND_URL}/api/notifications/read`);
    dispatch(markAsRead());
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

export const searchProjects = (searchTerm) => async (dispatch) => {
  dispatch(searchProjectsStart());
  try {
    const res = await axios.get(`${BACKEND_URL}/api/projects/search?search=${searchTerm}`);
    dispatch(searchProjectsSuccess(res.data));
  } catch (err) {
    console.error(err);
    dispatch(searchProjectsFailed(err.message));
  }
};


export const sortProjects = (sortOption) => async (dispatch) => {
  dispatch(sortProjectsStart());
  try {
    const res = await axios.get(`${BACKEND_URL}/api/projects/sort?sort=${sortOption}`);
    dispatch(sortProjectsSuccess(res.data));
  } catch (err) {
    console.error(err);
    dispatch(sortProjectsFailed(err.message));
  }
};

export const filterProjects = (semester, department) => async (dispatch) => {
  dispatch(filterProjectsStart());
  try {
    let url = `${BACKEND_URL}/api/projects/filter?`;
    
    if (semester) {
      url += `semester=${semester}&`;
    }
    
    if (department) {
      url += `department=${department}`;
    }

    const res = await axios.get(url);
    dispatch(filterProjectsSuccess(res.data));
  } catch (err) {
    console.error(err);
    dispatch(filterProjectsFailed(err.message));
  }
};

export const updateProfile = (userId, profileData) => async (dispatch) => {
  dispatch(updateUserStart());
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/user/${userId}`,
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(updateUserSuccess(response.data));
    console.log("User updated successfully");
  } catch (err) {
    dispatch(updateUserFailed(err.message || "Failed to update profile"));
    console.error("Error updating profile:", err);
  }
};

export const chatWithAI = (prompt) => async (dispatch) => {
  dispatch(aiRequestStart());
  try {
    const res = await axios.post(`${BACKEND_URL}/api/ai/chat`, { prompt });
    if (res.data && res.data.response) {
      dispatch(aiRequestSuccess(res.data.response));
    } else {
      throw new Error("Invalid response from AI");
    }
  } catch (err) {
    console.error("Error fetching AI response:", err);
    dispatch(aiRequestFailed(err.message));
  }
};