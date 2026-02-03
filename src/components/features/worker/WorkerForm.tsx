import { Form, Input } from "antd";

interface Props {
  form: any;
}

const WorkerForm: React.FC<Props> = ({ form }) => {
  return (
      <Form form={form} layout="vertical" requiredMark={false}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone_number"
        rules={[{ required: true, message: "Please enter phone number" }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>
        <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <Input placeholder="Enter address" />
      </Form.Item>

    </Form>


  );
};

export default WorkerForm;
