import { createSlice } from "@reduxjs/toolkit";

const backupSlice = createSlice({
  name: "backup",
  initialState: {
    backupUrl: null,
    isBackingUp: false,
    error: false,
    msg: "",
  },
  reducers: {
    backupRequestStart: (state) => {
      state.isBackingUp = true;
      state.error = false;
      state.msg = "";
    },
    backupRequestSuccess: (state, action) => {
      state.isBackingUp = false;
      state.backupUrl = action.payload.url;
      state.error = false;
      state.msg = "Backup completed successfully";
    },
    backupRequestFailed: (state, action) => {
      state.isBackingUp = false;
      state.error = true;
      state.msg = action.payload || "Backup failed";
    },
    clearBackupUrl: (state) => {
      state.backupUrl = null;
      state.msg = "";
    },
  },
});

export const {
  backupRequestStart,
  backupRequestSuccess,
  backupRequestFailed,
  clearBackupUrl,
} = backupSlice.actions;

export default backupSlice.reducer;
