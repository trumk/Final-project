import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    allUsers: null,
    currentUser: null,
    profile: null, 
    isFetching: false,
    error: false,
    msg: "",
  },
  reducers: {
    getUsersStart: (state) => {
      state.isFetching = true;
    },
    getUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.allUsers = action.payload;
      state.error = false;
    },
    getUsersFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch users";
    },
    getUserStart: (state) => {
      state.isFetching = true;
    },
    getUserSuccess: (state, action) => {
      state.isFetching = false;
      state.profile = action.payload; 
      state.error = false;
    },
    getUserFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch user";
    },
    updateUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateUserSuccess: (state, action) => {
      state.isFetching = false;
      state.profile = action.payload; 
      state.error = false;
      state.msg = "User updated successfully";
    },
    updateUserFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to update user";
    },
    deleteUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteUserSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
      state.msg = "User deleted successfully";
    },
    deleteUserFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to delete user";
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  getUserStart,
  getUserSuccess,
  getUserFailed,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
} = userSlice.actions;

export default userSlice.reducer;
