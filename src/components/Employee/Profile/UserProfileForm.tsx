import React from "react";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../types";
import { RootState, AppDispatch } from "../../../store/store";
import { updateUserProfileThunk } from "../../../store/employee/userSlice" // Import your thunk
import Spinner from "../../Spinner"; // Import your custom Spinner component

interface VacationFormProps {
  user: User | null;
  onSubmit: (values: User) => void;
}

const UserProfileForm: React.FC<VacationFormProps> = ({ onSubmit, user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.userStore);

  const handleFinish = (values: any) => {
    if (user) {
      dispatch(updateUserProfileThunk({ id: user.id, values }));
    }
  };

  return (
    <div>
    {loading ? (
      <Spinner /> 
    ) : (
      <Form
        initialValues={user || undefined}
        onFinish={handleFinish}
        layout="vertical"
        disabled={loading} // Disable the form while loading
      >
        <Form.Item label="First Name" name="first_name">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="last_name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="City" name="city">
          <Input />
        </Form.Item>
        <Form.Item label="Days Off" name="days_off">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Input disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    )}
  </div>
  );
};

export default UserProfileForm;
