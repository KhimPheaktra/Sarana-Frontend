import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";

interface Props {
  form: any;
}

const PaymentForm: React.FC<Props> = ({ form}) => {

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
    <Row gutter={16}>
       <Col xs={24} sm={12}>
        <Form.Item
          label="Customer Name"
          name="customer_name"
          rules={[{ required: true, message: "Please input Customer"}]}
        >
          <Input placeholder="Enter customer_name" />
        </Form.Item>
      </Col>
         <Col xs={24} sm={12}>
        <Form.Item
          label="Payment Type"
          name="payment_type"
          rules={[{ required: true, message: "Please select payment type" }]}
        >
          <Select placeholder="Select payment type">
            <Select.Option value="1">Cash</Select.Option>
            <Select.Option value="2">Credit Card</Select.Option>
            <Select.Option value="3">Bakor</Select.Option>
          </Select>
        </Form.Item>
      </Col>
        <Col xs={24} sm={12}>
        <Form.Item
          label="Reference ID"
          name="reference_id"
          rules={[{ required: true, message: "Please enter reference ID" }]}
        >
          <Input placeholder="Enter reference ID" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber placeholder="Enter amount" precision={2} style={{ width: '100%' }}/>
        </Form.Item>
      </Col>
       <Col xs={24} sm={12}>
          <Form.Item
            label="Date"
            name="payment_date"
            rules={[{ required: true, message: "Please enter purchase date" }]}
          >
            <DatePicker 
              placeholder="Enter purchase date"
              showTime
              format="YYYY-MM-DD HH:mm:ss" 
            />
          </Form.Item>
        </Col>

         <Col xs={24} sm={12}>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="1">Active</Select.Option>
            <Select.Option value="2">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Note"
          name="note"
        >
          <Input placeholder="Enter note" />
        </Form.Item>
      </Col>
    </Row>
  </Form>

  );
};

export default PaymentForm;
