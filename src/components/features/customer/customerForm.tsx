import { Col, Form, Input, Row } from "antd";

interface Props {
  form: any;
}

const CustomerForm: React.FC<Props> = ({ form }) => {
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
          label="Phone"
          name="phone_number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Email"
          name="email"
        >
          <Input placeholder="Enter email" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>
      </Col>

     
    </Row>
  </Form>

  );
};

export default CustomerForm;
