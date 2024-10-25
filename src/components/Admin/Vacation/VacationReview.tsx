import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, message } from "antd";
import { fetchVacations, updateVacationStatus } from "../../../store/admin/vacationAdminSlice"
import { RootState } from "../../../store/store"
import { ColumnsType } from "antd/es/table";
import { Vacation } from "../../types";
import { User } from "../../types";
import Spinner from "../../Spinner";
import type { AppDispatch } from "../../../store/store" // Adjust the path if necessary

export const useAppDispatch = () => useDispatch<AppDispatch>();

const VacationReview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vacations, loading, error } = useSelector((state: RootState) => state.vacationAdminStore);

  useEffect(() => {
    dispatch(fetchVacations());
  }, [dispatch]);

  const handleReview = async (status: string, record: Vacation) => {
    try {
      const resultAction = await dispatch(updateVacationStatus({ id: record.id, status }));

      if (updateVacationStatus.fulfilled.match(resultAction)) {
        // message.success(resultAction.payload.message);
      } else {
        message.error("Failed to update vacation status.");
      }
    } catch (error: any) {
      console.error("Error updating vacation:", error);
      message.error("Failed to update vacation.");
    }
  };

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

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Vacations</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          virtual
          scroll={{ x: 1300, y: 400 }}
          dataSource={vacations}
          columns={columns}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default VacationReview;
