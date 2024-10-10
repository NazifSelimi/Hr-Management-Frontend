import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message, Button, Form, Input } from 'antd';
import { fetchUserProfileThunk, updateUserProfileThunk } from '../../../redux/userSlice';
import { RootState, AppDispatch } from '../../../redux/store'; 
import { User } from '../../types';
import Spinner from '../../Spinner';

const UserProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); 
  const user = useSelector((state: RootState) => state.userStore.user);
  const loading = useSelector((state: RootState) => state.userStore.loading);
  const error = useSelector((state: RootState) => state.userStore.error);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
        days_off: user.days_off,
        role: user.role,
      });
    }
  }, [user, form]);

  const handleSave = async (values: User) => { 
    if (user) {
      try {
        await dispatch(updateUserProfileThunk({ id: user.id, values })).unwrap();
        // message.success("Your profile has been updated successfully.");
      } catch (err: unknown) {
        if (err instanceof Error) {
          message.error(err.message);
        } else {
          message.error("Failed to update profile. Please try again.");
        }
      }
    }
  };

  if (loading) {
    return <div><Spinner/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item name="first_name" label="First Name">
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="Last Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="City">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item label="Days Off">
          <Input value={user?.days_off} disabled />
        </Form.Item>
        <Form.Item label="Role">
          <Input value={user?.role} disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfile;
