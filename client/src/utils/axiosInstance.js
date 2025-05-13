// utils/axiosInstance.js
import axios from "axios";
import { refreshToken } from "./api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Endpoints that should NOT trigger token refresh (public endpoints)
const excludeFromRefresh = [
  "/auth/login",
  "/auth/register",
  "/auth/update-password",
];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent refresh token logic on public endpoints
    const isExcluded = excludeFromRefresh.some((url) =>
      originalRequest.url?.includes(url)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isExcluded
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        await refreshToken();
        isRefreshing = false;
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    // Propagate error to the component's catch block
    return Promise.reject(error);
  }
);

export default axiosInstance;
