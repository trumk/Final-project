import { createSlice } from "@reduxjs/toolkit";
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: {
      allProjects: null,
      isFetching: false,
      error: false,
    },
    project: {
      currentProject: null,
      isFetching: false,
      error: false,
    },
    createProject: {
      isFetching: false,
      error: false,
    },
    updateProject: {
      currentProject: null,
      isFetching: false,
      error: false,
    },
    deleteProject: {
      isFetching: false,
      error: false,
    },
    msg: "",
  },
  reducers: {
    getProjectsStart: (state) => {
      state.project.isFetching = true;
    },
    getProjectsSuccess: (state, action) => {
      state.project.isFetching = false;
      state.project.allProjects = action.payload;
      state.project.error = false;
    },
    getProjectsFailed: (state) => {
      state.project.isFetching = false;
      state.project.error = true;
    },
    getProjectStart: (state) => {
      state.project.isFetching = true;
    },
    getProjectSuccess: (state, action) => {
      state.project.isFetching = false;
      state.project.currentProject = action.payload;
      state.project.error = false;
    },
    getProjectFailed: (state) => {
      state.project.isFetching = false;
      state.project.error = true;
    },
    createProjectStart: (state) => {
      state.createProject.isFetching = true;
      state.createProject.error = false;
    },
    createProjectSuccess: (state, action) => {
      state.createProject.isFetching = false;
      state.createProject.error = false;
      state.msg = action.payload;
    },
    createProjectFailed: (state, action) => {
      state.createProject.isFetching = false;
      state.createProject.error = true;
      state.msg = action.payload;
    },
    updateProjectStart: (state) => {
      state.updateProject.isFetching = true;
      state.updateProject.error = false;
    },
    updateProjectSuccess: (state, action) => {
      state.updateProject.isFetching = false;
      state.updateProject.error = false;
      state.msg = action.payload;
    },
    updateProjectFailed: (state, action) => {
      state.updateProject.isFetching = false;
      state.updateProject.error = true;
      state.msg = action.payload;
    },
    deleteProjectStart: (state) => {
      state.deleteProject.isFetching = true;
      state.deleteProject.error = false;
    },
    deleteProjectSuccess: (state, action) => {
      state.deleteProject.isFetching = false;
      state.deleteProject.error = false;
      state.msg = action.payload;
    },
    deleteProjectFailed: (state, action) => {
      state.deleteProject.isFetching = false;
      state.deleteProject.error = true;
      state.msg = action.payload;
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
    deleteProjectFailed
} = projectSlice.actions
export default projectSlice.reducer
