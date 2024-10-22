import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    response: null,
    history: [], 
    isFetching: false,
    error: false,
    msg: "",
  },
  reducers: {
    aiRequestStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.msg = "";
    },
    aiRequestSuccess: (state, action) => {
      state.isFetching = false;
      state.response = action.payload;
      state.history.push({ prompt: action.meta.arg, response: action.payload }); 
      state.error = false;
      state.msg = "AI response fetched successfully";
    },
    aiRequestFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload || "Failed to fetch AI response";
    },
    clearAIResponse: (state) => {
      state.response = null;
      state.msg = "";
    },
    clearHistory: (state) => {
      state.history = []; 
    },
  },
});

export const {
  aiRequestStart,
  aiRequestSuccess,
  aiRequestFailed,
  clearAIResponse,
  clearHistory,
} = aiSlice.actions;

export default aiSlice.reducer;
