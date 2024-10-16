import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { ColumnsType } from "antd/es/table";
import { Table, Button, Space, message } from "antd";
import { Vacation } from "../../types";
import { User } from "../../types";
import Spinner from "../../Spinner";
import { fetchVacations, updateVacation } from "../../../apiService";

const VacationReview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (setter: React.Dispatch<React.SetStateAction<any>>) => {
      try {
        const data = await fetchVacations();
        setter(data);
      } catch (error: any) {
        console.error(`Error fetching vacations:`, error);
        message.error(`Failed to fetch vacations: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        await fetchData(setVacations);
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
      await updateVacation(record.id, { status: status });

      // message.success(response.data.message); //by default it has a message
      fetchData(setVacations);
    } catch (error: any) {
      console.error("Error updating project:", error);
      message.error(error.data.message);
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
        <Spinner />
      ) : (
        <Table
          virtual
          scroll={{ x: 1000, y: 300 }}
          dataSource={vacations}
          columns={columns}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default VacationReview;
