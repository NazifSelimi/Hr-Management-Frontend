import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { ColumnsType } from "antd/es/table";
import { Table, Button, Space, message } from "antd";
import { Vacation } from "../types";
import { User } from "../types";
import Spinner from "../Spinner";

const VacationView: React.FC = () => {
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
        await fetchData("/employee-vacation", setVacations);
      } catch (error: any) {
        console.error("Error fetching vacations:", error);
        setError(error.response.data.message);
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
        <Table virtual scroll={{ x: 1000, y: 300 }}
        dataSource={vacations} columns={columns} rowKey="id" />
      )}
    </div>
  );
};

export default VacationView;
