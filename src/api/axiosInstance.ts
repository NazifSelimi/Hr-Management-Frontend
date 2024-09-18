import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost/api",
  withCredentials: true, // Include credentials (cookies) in requests
});

// Add a request interceptor to dynamically set CSRF and Auth tokens (idk if this is even needed?)
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
// export const getEmployees = async () => {
//   try {
//     const response = await axiosInstance.get("/employees");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     throw error;
//   }
// };

export default axiosInstance;
