import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ACCESS_DENIED_ERROR, ENDPOINTS } from "../common/constants";
import { axiosPublic } from "../api/axiosPublic";

const name = "auth";

export const logUserIn = createAsyncThunk(
  `${name}/logUserIn`,
  async (formData) => {
    try {
      const response = await axiosPublic.post(ENDPOINTS.login, formData);
      const data = response.data;
      localStorage.setItem("user", data?.role);
      localStorage.setItem("access", data?.access);
      localStorage.setItem("refresh", data?.refresh);
      return data;
    } catch (error) {
      localStorage.clear();
      return Promise.reject(error);
    }
  },
);

export const logUserOut = createAsyncThunk(`${name}/logUserOut`, async () => {
  localStorage.clear();
});

const initialState = {
  user: localStorage.getItem("user"),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    clearError: (state) => {
      if (state.error === ACCESS_DENIED_ERROR) return state;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logUserIn.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logUserIn.fulfilled, (state, action) => {
      state.user = action.payload.role;
      state.isLoading = false;
    });
    builder.addCase(logUserIn.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.error = "try_again";
    });
    builder.addCase(logUserOut.fulfilled, (state, action) => {
      state.user = null;
      state.isLoading = false;
    });
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
