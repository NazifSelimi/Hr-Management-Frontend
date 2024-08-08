import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/api", // Default base URL for all requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
  withCredentials: true, // Include credentials if needed
  withXSRFToken: true,
});

export default axiosInstance;
