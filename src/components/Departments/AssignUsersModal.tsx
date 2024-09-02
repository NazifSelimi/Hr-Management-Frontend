import React from 'react';
import { Form, Input, Button, Modal, Row, Col, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { User } from '../types';

interface AssignUsersModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  department: string;
  users: User[]; // Added users prop
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({ visible, onCancel, onSubmit, department }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/assign-users/${department}`, {
        departments: values.users.map((user: { id: string, position: string }) => ({
          id: user.id,
          position: user.position,
        })),
      });
      onSubmit(response.data);
      onCancel();
    } catch (error: any) {
      console.error("Error assigning users:", error);
      alert("Failed to assign users. Please check the server response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Assign Users"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        name="assign-users-form"
        initialValues={{ users: [] }}
      >
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row key={key} gutter={16}>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      fieldKey={[fieldKey as React.Key, 'id']}
                      label="User"
                      rules={[{ required: true, message: 'Please select a user' }]}
                    >
                      <Input placeholder="User ID" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'position']}
                      fieldKey={[fieldKey as React.Key, 'position']}
                      label="Position"
                      rules={[{ required: true, message: 'Please input the position' }]}
                    >
                      <Input placeholder="Position" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add User
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? <Spin /> : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignUsersModal;
