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
    departmentProjects: null,
    departmentLikes: null,
  },
  reducers: {
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
    getProjectAdminStart: (state) => {
      state.isFetching = true;
    },
    getProjectAdminSuccess: (state, action) => {
      state.isFetching = false;
      state.currentProject = action.payload;
      state.error = false;
    },
    getProjectAdminFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch the project";
    },
    searchProjectsStart: (state) => {
      state.isFetching = true;
    },
    searchProjectsSuccess: (state, action) => {
      state.isFetching = false;
      state.allProjects = action.payload; 
      state.error = false;
    },
    searchProjectsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to search projects";
    },
    sortProjectsStart: (state) => {
      state.isFetching = true;
    },
    sortProjectsSuccess: (state, action) => {
      state.isFetching = false;
      state.allProjects = action.payload;
      state.error = false;
    },
    sortProjectsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to sort projects";
    },
    filterProjectsStart: (state) => {
      state.isFetching = true;
    },
    filterProjectsSuccess: (state, action) => {
      state.isFetching = false;
      state.allProjects = action.payload; 
      state.error = false;
    },
    filterProjectsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to filter projects";
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
    getAllCommentsStart: (state) => {
      state.isFetching = true;
    },
    getAllCommentsSuccess: (state, action) => {
      state.isFetching = false;
      state.comments = action.payload; 
      state.error = false;
    },
    getAllCommentsFailed: (state, action) => {
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
    deleteCommentStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteCommentSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload
      );
      state.msg = "Comment deleted successfully";
    },
    deleteCommentFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to delete comment";
    },
    likeProjectStart: (state) => {
      state.isFetching = true;
    },
    likeProjectSuccess: (state, action) => {
      state.isFetching = false;
      state.currentProject.likes += 1; 
      state.error = false;
    },
    likeProjectFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to like project";
    },
    getProjectByDepartmentStart: (state) => {
      state.isFetching = true;
    },
    getProjectByDepartmentSuccess: (state, action) => {
      state.isFetching = false;
      state.departmentProjects = action.payload;
      state.error = false;
    },
    getProjectByDepartmentFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch projects by department";
    },
    getLikeByDepartmentStart: (state) => {
      state.isFetching = true;
    },
    getLikeByDepartmentSuccess: (state, action) => {
      state.isFetching = false;
      state.departmentLikes = action.payload;
      state.error = false;
    },
    getLikeByDepartmentFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch likes by department";
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
  getProjectAdminStart,
  getProjectAdminSuccess,
  getProjectAdminFailed,
  searchProjectsStart,
  searchProjectsSuccess,
  searchProjectsFailed,
  sortProjectsStart,
  sortProjectsSuccess,
  sortProjectsFailed,
  filterProjectsStart,
  filterProjectsSuccess,
  filterProjectsFailed,
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
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailed,
  likeProjectStart,
  likeProjectSuccess,
  likeProjectFailed,
  getAllCommentsStart,
  getAllCommentsSuccess,
  getAllCommentsFailed,
  getProjectByDepartmentStart, 
  getProjectByDepartmentSuccess,
  getProjectByDepartmentFailed,
  getLikeByDepartmentStart, 
  getLikeByDepartmentSuccess,
  getLikeByDepartmentFailed,
} = projectSlice.actions;

export default projectSlice.reducer;
