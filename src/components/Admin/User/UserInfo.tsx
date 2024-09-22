// UserInfo.tsx
import React from "react";
import { Card, Row, Col, Typography, Divider } from "antd";
import { User } from "../../types";

const { Text, Title } = Typography;

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => (
  <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
    <Row>
      <Col span={6}>
        <Text strong>Name:</Text>
      </Col>
      <Col span={18}>
        <Text>
          {user.first_name} {user.last_name}
        </Text>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={6}>
        <Text strong>Email:</Text>
      </Col>
      <Col span={18}>
        <Text>{user.email}</Text>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={6}>
        <Text strong>Phone:</Text>
      </Col>
      <Col span={18}>
        <Text>{user.phone}</Text>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={6}>
        <Text strong>City:</Text>
      </Col>
      <Col span={18}>
        <Text>{user.city}</Text>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={6}>
        <Text strong>Address:</Text>
      </Col>
      <Col span={18}>
        <Text>{user.address}</Text>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={6}>
        <Text strong>Role:</Text>
      </Col>
      <Col span={18}>
        <Text>{user.role}</Text>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={6}>
        <Text strong>Days Off:</Text>
      </Col>
      <Col span={18}>
        <Text>{user.days_off}</Text>
      </Col>
    </Row>
  </Card>
);

export default UserInfo;
