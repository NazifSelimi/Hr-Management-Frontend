import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Typography, Divider, Row, Col, Table } from "antd"; // Import the correct RootState type
import Spinner from "../../Spinner";
import { fetchDepartments } from "../../../store/employee/departmentsSlice"
import { RootState, AppDispatch } from "../../../store/store";
import { Department, User } from "../../types";

const { Title, Text } = Typography;

const MyDepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { departments, loading, error } = useSelector(
    (state: RootState) => state.departmentStore
  );

  const department = departments.find((dep) => dep.id === id);

  useEffect(() => {
    if (!department) {
      // Fetch departments if not already loaded
      dispatch(fetchDepartments());
    }
  }, [dispatch, department]);

  if (loading) return <Spinner />;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!department) return <p>Department not found</p>;

  const userColumns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Position",
      render: (_: any, record: User) => record.pivot?.position,
      key: "position",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <>
      <Title level={2} style={{ textAlign: "center" }}>
        Department Details
      </Title>
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "14px" }}>
              Name:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "14px" }}>{department.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Department Colleagues</Title>
            <Table
              virtual
              scroll={{ x: 500, y: 500 }}
              dataSource={department.users}
              columns={userColumns}
              rowKey="id"
              pagination={false}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default MyDepartmentDetails;
