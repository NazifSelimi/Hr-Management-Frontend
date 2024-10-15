import axios from "axios";
import { message } from "antd";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost/api",
  withCredentials: true, // Include credentials (cookies) in requests
});

// Add a request interceptor to dynamically set CSRF and Auth tokens
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  const authToken = localStorage.getItem("authToken");

  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});

// Add a response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response has a message, show it
    if (response.data.message) {
      message.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Customize error handling logic
    if (error.response) {
      // Server-side error
      message.error(
        error.response.data.message || "An error occurred. Please try again."
      );
    } else if (error.request) {
      // Network error
      message.error("Network error. Please check your internet connection.");
    } else {
      // Client-side error
      message.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

// Export the axios instance
export default axiosInstance;
