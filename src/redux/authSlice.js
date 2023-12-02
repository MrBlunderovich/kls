import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ACCESS_DENIED_ERROR, ENDPOINTS } from "../common/constants";
import { axiosPublic } from "../api/axiosPublic";

const name = "auth";

export const logUserIn = createAsyncThunk(
  `${name}/logUserIn`,
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosPublic.post(ENDPOINTS.login, formData);
      const data = response.data;
      localStorage.setItem("user", data?.role);
      localStorage.setItem("access", data?.access);
      localStorage.setItem("refresh", data?.refresh);
      return data;
    } catch (error) {
      localStorage.clear();
      return rejectWithValue(error.message);
    }
  },
);

export const logUserOut = createAsyncThunk(
  `${name}/logUserOut`,
  async (_, { dispatch }) => {
    localStorage.clear();
    dispatch(authActions.clearData());
  },
);

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
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logUserIn.pending, (state) => {
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
      state.error = action.payload;
    });
    builder.addCase(logUserOut.fulfilled, (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    });
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
