import { Col, Form, Input, Row, Select } from "antd";

interface Props {
  form: any;
}

const UserForm: React.FC<Props> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" requiredMark={false}>
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  </Form>

  );
};

export default UserForm;
