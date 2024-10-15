import React from "react";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect } from "react";
import { message } from "antd";
import { fetchVacations } from "../../../store/employee/vacationsSlice"
import Spinner from "../../Spinner";

interface VacationFormProps {
  onSubmit: (values: {
    user_id: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    type: string;
    status: boolean;
  }) => void;
}

const VacationForm: React.FC<VacationFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.vacationsStore);

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

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
    });
  };

  // TODO: FIX THE SPINNER SO WHEN WE REQUEST VACATION, THE PAGE SHOULD DISPLAY LOADING (SPINNER) !!!!!!!!!
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: "Please enter the start date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: "Please enter the end date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Please enter your reason" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: "Please enter the type of vacation" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Request Vacation
            </Button>
          </Form.Item>
        </Form>)
      }

    </>
  );
};

export default VacationForm;
