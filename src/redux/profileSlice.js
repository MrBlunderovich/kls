import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import yearLimiter from "../utils/yearLimiter";

const name = "profile";

export const getDistributorById = createAsyncThunk(
  `${name}/getDistributorById`,
  async (distributorId) => {
    try {
      const response = await axiosPrivate.get(`/distributors/${distributorId}`);

      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const getOrderHistoryById = createAsyncThunk(
  `${name}/getOrderHistoryById`,
  async ({ id, queryParams }) => {
    try {
      const response = await axiosPrivate.get(
        `transactions/distributor/${id}`,
        {
          params: queryParams,
        },
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const getReturnHistoryById = createAsyncThunk(
  `${name}/getReturnHistoryById`,
  async ({ id, queryParams }) => {
    try {
      const response = await axiosPrivate.get(
        `transactions/return/distributor/${id}`,
        {
          params: queryParams,
        },
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const initialState = {
  distributorInfo: {
    name: "Загрузка...",
    inn: "Загрузка...",
    region: "Загрузка...",
    contact: "",
    contact2: "",
  },
  isReturns: false,
  category: "",
  startDate: "",
  endDate: "",
  data: [],
  isDistributorLoading: false,
  isDataLoading: false,
};
export const profileSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSales: (state, action) => {
      state.isReturns = action.payload === "return" ? true : false;
    },
    setStartDate: (state, action) => {
      state.startDate = yearLimiter(action.payload);
    },
    setEndDate: (state, action) => {
      state.endDate = yearLimiter(action.payload);
    },
    clearData: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getDistributorById.pending, (state) => {
        state.isDistributorLoading = true;
      })
      .addCase(getDistributorById.fulfilled, (state, action) => {
        state.isDistributorLoading = false;
        state.distributorInfo = action.payload;
      })
      .addCase(getDistributorById.rejected, (state) => {
        state.isDistributorLoading = false;
      });

    builder
      .addCase(getOrderHistoryById.pending, handleDataPending)
      .addCase(getOrderHistoryById.fulfilled, handleDataFulfilled)
      .addCase(getOrderHistoryById.rejected, handleDataRejected);
    builder
      .addCase(getReturnHistoryById.pending, handleDataPending)
      .addCase(getReturnHistoryById.fulfilled, handleDataFulfilled)
      .addCase(getReturnHistoryById.rejected, handleDataRejected);
  },
});

function handleDataPending(state) {
  state.isDataLoading = true;
}

function handleDataFulfilled(state, action) {
  state.isDataLoading = false;
  state.data = action.payload;
}

function handleDataRejected(state) {
  state.isDataLoading = false;
}

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;
