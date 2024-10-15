import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, message } from "antd";
import { fetchVacations } from "../../../store/employee/vacationsSlice" 
import Spinner from "../../Spinner";
import { RootState, AppDispatch } from "../../../store/store";

const VacationView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vacations, loading, error } = useSelector((state: RootState) => state.vacationsStore);

  useEffect(() => {
    const loadVacations = async () => {
      try {
        await dispatch(fetchVacations()).unwrap();
      } catch (error: any) {
        message.error(`Failed to fetch vacations: ${error.message}`);
      }
    };

    loadVacations();
  }, [dispatch]);

  if (error) return <p>{error}</p>;

  const columns = [
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
