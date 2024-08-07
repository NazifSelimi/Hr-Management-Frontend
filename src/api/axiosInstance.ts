// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost", // Adjust this URL to match your API endpoint
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: false, // Ensure this is false if you are not using cookies or session-based requests
});

export default axiosInstance;
