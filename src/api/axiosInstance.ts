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
    const response = await axiosInstance.get("api/employees");
    return response.data; // Handle the response data
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error; // Handle the error
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Send DELETE request to the API endpoint
    //await getCsrfToken();
    await axios.delete(`/api/user-delete/${userId}`);

    console.log("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error);
    // Handle the error appropriately, e.g., showing a message to the user
    throw new Error("Failed to delete user.");
  }
};

const getCsrfToken = async () => {
  try {
    await axios.get("/sanctum/csrf-cookie"); // Adjust the URL if needed
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};

export default axiosInstance;
