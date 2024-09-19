// src/components/MyProjects.tsx
import React, { useEffect } from "react";
import { Table, Button, message, Spin, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../../redux/projectsSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import { Project } from "../../types";

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Using useSelector to get projects and loading state from Redux
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    // Fetch projects when component mounts
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    // Display error message if there's an error fetching projects
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleView = (id: string) => {
    navigate(`/my-project/${id}`);
  };

  const columns: ColumnsType<Project> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      <h2>Projects</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          virtual
          scroll={{ x: 1000, y: 500 }}
          dataSource={projects}
          columns={columns}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default MyProjects;
