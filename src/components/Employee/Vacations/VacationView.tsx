import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { ColumnsType } from "antd/es/table";
import { Table, Button, Space, message } from "antd";
import { Vacation } from "../../types";
import { User } from "../../types";
import Spinner from "../../Spinner";
import { fetchEmployeeVacation } from "../../../apiService";

const VacationView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await fetchEmployeeVacation();
        setVacations(response);
      } catch (error: any) {
        setError(error);
        console.error(`Error fetching vacations:`, error);
        message.error(`Failed to fetch vacations: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations();
  }, []);

  if (error) return <p>{error}</p>;

  const columns: ColumnsType<Vacation> = [
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
  ];

  return (
    <div>
      <h2>Vacations</h2>
      <h3>
        Available days off:{" "}
        {vacations.length > 0 ? vacations[0]?.user?.days_off : "N/A"}
      </h3>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          virtual
          scroll={{ x: 1000, y: 500 }}
          dataSource={vacations}
          columns={columns}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default VacationView;
