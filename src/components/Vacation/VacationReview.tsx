import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { ColumnsType } from "antd/es/table";
import { Table, Button, Space, message, Spin } from "antd";
import { Vacation } from "../types";
import { User } from "../types";

const VacationReview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<any>>
    ) => {
      try {
        const { data } = await axiosInstance.get(endpoint);
        setter(data);
      } catch (error: any) {
        console.error(`Error fetching ${endpoint}:`, error);
        message.error(`Failed to fetch ${endpoint}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        await fetchData("/vacation", setVacations);
      } catch (error: any) {
        console.error("Error fetching vacations:", error);
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations();
  }, [fetchData]);

  const handleReview = async (status: string, record: Vacation) => {
    try {
      const response = await axiosInstance.patch(`/vacation/${record.id}`, {
        status: status,
      });

      message.success(response.data.message);
      fetchData("/vacation", setVacations);
    } catch (error: any) {
      console.error("Error updating project:", error);
      message.error("Failed to update project.");
    }
  };

  if (error) return <p>{error}</p>;

  const columns: ColumnsType<Vacation> = [
    {
      title: "Employee",
      dataIndex: "user",
      key: "user",
      render: (employee: User) =>
        employee.first_name + " " + employee.last_name,
    },
    {
      title: "Start Date",
      dataIndex: "formatted_start_date",
      key: "formatted_start_date",
    },
    {
      title: "End Date",
      dataIndex: "formatted_end_date",
      key: "formatted_end_date",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleReview("accept", record)}
            disabled={record.status !== "pending"}
          >
            Accept
          </Button>
          <Button
            onClick={() => handleReview("reject", record)}
            disabled={record.status !== "pending"}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Vacations</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table virtual scroll={{ x: 1000, y: 300 }} 
        dataSource={vacations} columns={columns} rowKey="id" />
      )}
    </div>
  );
};

export default VacationReview;
