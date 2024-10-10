// src/components/MyProjects.tsx
import React, { useEffect } from "react";
import { Table, Button, message, Spin, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../../../redux/departmentsSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import { Department } from "../../types";
import Spinner from "../../Spinner";

const MyDepartments: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Using useSelector to get projects and loading state from Redux
  const { departments, loading, error } = useSelector(
    (state: RootState) => state.departmentStore
  );

  useEffect(() => {
    // Fetch projects when component mounts
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    // Display error message if there's an error fetching projects
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleView = (id: string) => {
    navigate(`/my-department/${id}`);
  };

  const columns: ColumnsType<Department> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: (
                  <>
                    <EyeOutlined /> View
                  </>
                ),
                onClick: () => handleView(record.id),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: "35px" }} />}
            style={{ padding: "0", height: "auto" }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <h2>Departments</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          virtual
          scroll={{ x: 500, y: 500 }}
          dataSource={departments}
          columns={columns}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default MyDepartments;
