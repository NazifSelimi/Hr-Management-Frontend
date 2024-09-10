import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Department } from "../types";
import { Spin, message } from "antd";
import VacationForm from "./VacationForm";

const RequestVacationView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     try {
  //       const response = await axiosInstance.get<Department[]>("/departments");
  //       setVacations(response.data);
  //     } catch (error) {
  //       console.error("Error fetching departments:", error);
  //       setError("Failed to load departments.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDepartments();
  // }, []);

  const handleSubmit = async (values: {
    user_id: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    type: string;
    status: boolean;
  }) => {
    try {
      const response = await axiosInstance.post("/request-vacation", values);

      if (response.status === 201) {
        alert(response.data.message);
      } else {
        console.error("Unexpected response:", response);
        alert(response.data.message);
      }
    } catch (error: any) {
      console.error("Error requesting days off:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred while requesting days off.";
      alert(message);
    }
  };

  if (error) return <p>{error}</p>;

  return <VacationForm onSubmit={handleSubmit} />;
};

export default RequestVacationView;
