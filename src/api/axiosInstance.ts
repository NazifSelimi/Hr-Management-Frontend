import axios from "axios";

function getCsrfToken() {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  return csrfToken ? decodeURIComponent(csrfToken) : null;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost/api", // Default base URL for all requests
  headers: {
    "Content-Type": "application/json", // Default content type
    "X-XSRF-TOKEN": getCsrfToken(), // Manually set the CSRF token
  },
  withCredentials: true, // Ensure credentials (cookies) are sent with every request
});

export const getEmployees = async () => {
  try {
    // Make an API request to get the list of employees
    const response = await axiosInstance.get("/employees");
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error; // Handle the error
  }
};

export default axiosInstance;
