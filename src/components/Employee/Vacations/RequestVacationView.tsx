import React, { useState } from "react";
// import axiosInstance from "../../../api/axiosInstance";
import VacationForm from "./VacationForm";
import { requestVacation } from "../../../apiService";
import { message } from "antd";

const RequestVacationView: React.FC = () => {
  const handleSubmit = async (values: {
    user_id: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    type: string;
    status: boolean;
  }) => {
    try {
      // const response = await axiosInstance.post("/request-vacation", values);
      const response = await requestVacation(values);

      if (response.status === 201) {
        // message.success(response.data.message);
      } else {
        console.error("Unexpected response:", response);
        message.error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error requesting days off:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred while requesting days off.";
      alert(message);
    } finally {
    }
  };

  return <VacationForm onSubmit={handleSubmit} />;
};

export default RequestVacationView;
