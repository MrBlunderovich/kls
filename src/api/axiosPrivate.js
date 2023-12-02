import axios from "axios";
import { refreshAccessToken } from "./refreshAccessToken";
import { BASE_URL } from "../common/constants";
import { axiosPublic } from "./axiosPublic";

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.authorization = `Token ${accessToken}`;
      return config;
    }
    return Promise.reject(
      "axiosPrivate request interceptor says: No access token found",
    );
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  //onStatus 2xx
  (response) => response,

  //onStatus not-2xx
  async (error) => {
    const originalRequest = error?.config;

    if (
      error?.response?.status === 401 &&
      !originalRequest?.refreshRequestSent
    ) {
      originalRequest.refreshRequestSent = true;
      const refreshToken = localStorage.getItem("refresh");
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        localStorage.setItem("access", newAccessToken);
        originalRequest.headers.authorization = `Token ${newAccessToken}`;
        return axiosPublic(originalRequest);
      }
      localStorage.clear();
      document.location.href = "/logout";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export { axiosPrivate };
