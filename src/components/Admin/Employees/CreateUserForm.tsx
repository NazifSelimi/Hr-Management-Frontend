import { Form, Input, Button, Select } from "antd";
import Spinner from "../../Spinner";

interface CreateUserFormProps {
  onSubmit: (values: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    role: string;
    days_off: number;
  }) => void;
  loading: boolean;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
    });
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        name="first_name"
        label="First Name"
        rules={[
          { required: true, message: "Please enter employee first name" },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[{ required: true, message: "Please enter employee last name" }]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        name="email"
        label="E-mail"
        rules={[{ required: true, message: "Please enter employee email" }]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        name="phone"
        label="Phone No."
        rules={[
          { required: true, message: "Please enter employee phone number" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
        rules={[{ required: true, message: "Please enter employee city" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please enter employee address" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="role"
        label="Role"
        rules={[
          {
            required: true,
            message: "Please select one role",
          },
        ]}
      >
        <Select
          placeholder="Select role"
          loading={loading}
          notFoundContent={loading ? <Spinner /> : "No data"}
        >
          <Select.Option key="employee" value="employee">
            Employee
          </Select.Option>
          <Select.Option key="admin" value="admin">
            Admin
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Create User
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUserForm;
