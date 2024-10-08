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

export const getCommentsByProject = (projectId, idToken) => async (dispatch) => {
  dispatch(getCommentsStart());
  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}; // Chỉ gửi token nếu có
  try {
    const res = await axios.get(`${BACKEND_URL}/api/projects/${projectId}/comments`, {
      headers,
    });
    dispatch(getCommentsSuccess(res.data));
  } catch (error) {
    dispatch(getCommentsFailed(error.message));
  }
};

// Thêm bình luận vào dự án
export const addComment = (projectId, commentData, idToken) => async (dispatch) => {
  dispatch(addCommentStart());
  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}; // Chỉ gửi token nếu có
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/projects/${projectId}/comments`,
      commentData,
      { headers }
    );
    dispatch(addCommentSuccess(res.data));
  } catch (error) {
    dispatch(addCommentFailed(error.message));
  }
};

// Like dự án
export const likeProject = (projectId, idToken) => async (dispatch) => {
  dispatch(likeProjectStart());
  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}; // Chỉ gửi token nếu có
  try {
    await axios.post(`${BACKEND_URL}/api/projects/${projectId}/like`, {}, { headers });
    dispatch(likeProjectSuccess());
  } catch (error) {
    dispatch(likeProjectFailed(error.message));
  }
};

export const getNotifications = async (dispatch, idToken) => {
  dispatch(getNotificationsStart());
  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}; // Xử lý Firebase token (nếu có)
  try {
    const res = await axios.get(`${BACKEND_URL}/api/notifications`, { headers });
    dispatch(getNotificationsSuccess(res.data));
  } catch (error) {
    dispatch(getNotificationsFailed(error.message));
  }
};

export const markNotificationsAsRead = async (dispatch, idToken) => {
  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}; // Xử lý Firebase token (nếu có)
  try {
    await axios.put(`${BACKEND_URL}/api/notifications/read`, {}, { headers });
    dispatch(markAsRead());
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

