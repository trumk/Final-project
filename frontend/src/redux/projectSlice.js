import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: null,
    currentProject: null,
    isFetching: false,
    error: false,
    msg: "",
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
} = projectSlice.actions;

export default projectSlice.reducer;
