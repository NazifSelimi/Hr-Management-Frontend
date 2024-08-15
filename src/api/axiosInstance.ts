import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/api", // Default base URL for all requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
  withCredentials: true, // Ensure this is false if you are not using cookies or session-based requests
  withXSRFToken: true,
});

export const getEmployees = async () => {
  try {
    const response = await axiosInstance.get("/employees");
    return response.data; // Handle the response data
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error; // Handle the error
  }
};

export default axiosInstance;
