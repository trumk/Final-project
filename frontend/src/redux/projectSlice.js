import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: null,
    currentProject: null,
    isFetching: false,
    error: false,
    msg: "",
    comments: [], 
    notifications: [], 
    unreadCount: 0, 
  },
  reducers: {
    // Projects actions
    getProjectsStart: (state) => {
      state.isFetching = true;
    },
    getProjectsSuccess: (state, action) => {
      state.isFetching = false;
      state.allProjects = action.payload;
      state.error = false;
    },
    getProjectsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch projects";
    },
    getProjectStart: (state) => {
      state.isFetching = true;
    },
    getProjectSuccess: (state, action) => {
      state.isFetching = false;
      state.currentProject = action.payload;
      state.error = false;
    },
    getProjectFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch the project";
    },
    createProjectStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    createProjectSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.msg = action.payload;
    },
    createProjectFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to create the project";
    },
    updateProjectStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateProjectSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.msg = action.payload;
    },
    updateProjectFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to update the project";
    },
    deleteProjectStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteProjectSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.msg = action.payload;
    },
    deleteProjectFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to delete the project";
    },

    // Comments actions
    getCommentsStart: (state) => {
      state.isFetching = true;
    },
    getCommentsSuccess: (state, action) => {
      state.isFetching = false;
      state.comments = action.payload;
      state.error = false;
    },
    getCommentsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch comments";
    },
    addCommentStart: (state) => {
      state.isFetching = true;
    },
    addCommentSuccess: (state, action) => {
      state.isFetching = false;
      state.currentProject.comments.push(action.payload); 
      state.error = false;
    },
    addCommentFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to add comment";
    },

    // Like actions
    likeProjectStart: (state) => {
      state.isFetching = true;
    },
    likeProjectSuccess: (state, action) => {
      state.isFetching = false;
      state.currentProject.likes += 1; // Cộng thêm 1 like
      state.error = false;
    },
    likeProjectFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to like project";
    },

    // Notification actions
    getNotificationsStart: (state) => {
      state.isFetching = true;
    },
    getNotificationsSuccess: (state, action) => {
      state.isFetching = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      state.error = false;
    },
    getNotificationsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch notifications";
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  getProjectsStart,
  getProjectsSuccess,
  getProjectsFailed,
  getProjectStart,
  getProjectSuccess,
  getProjectFailed,
  createProjectStart,
  createProjectSuccess,
  createProjectFailed,
  updateProjectStart,
  updateProjectSuccess,
  updateProjectFailed,
  deleteProjectStart,
  deleteProjectSuccess,
  deleteProjectFailed,
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailed,
  addCommentStart,
  addCommentSuccess,
  addCommentFailed,
  likeProjectStart,
  likeProjectSuccess,
  likeProjectFailed,
  getNotificationsStart,
  getNotificationsSuccess,
  getNotificationsFailed,
  markAsRead,
} = projectSlice.actions;

export default projectSlice.reducer;
