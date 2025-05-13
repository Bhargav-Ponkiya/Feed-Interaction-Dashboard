import API from "./axiosInstance";

// Auth API calls
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);
export const logoutUser = () => API.get("/auth/logout");
export const refreshToken = () => API.get("/auth/refresh-token");

// Feed APIs
export const fetchFeed = () => API.get("/feed/aggregate");

// Post actions
export const savePost = (postData) => API.post("/feed/savePost", postData);
export const sharePost = (postData) => API.post("/feed/share", postData);
export const reportPost = (postData) => API.post("/feed/report", postData);

// User profile
export const getCurrentUser = () => API.get("/users/me");
export const updateProfile = (data) => API.patch("/users/update-profile", data);
export const updatePassword = (data) =>
  API.patch("/users/update-password", data);

// User Credits
export const getUserCredits = () => API.get("/users/credits");

// User Dashboard
export const getUserDashboard = () => API.get("/users/dashboard");

// Admin APIs
export const fetchUserAnalytics = () => API.get("/admin/users/analytics");
export const fetchSystemAnalytics = () => API.get("/admin/analytics");
export const updateUserCredits = ({ userId, credits }) =>
  API.patch("/admin/update-credits", { userId, credits });
export const fetchTimeAnalytics = (range = "weeks") =>
  API.get(`/admin/analytics/time?range=${range}`);
