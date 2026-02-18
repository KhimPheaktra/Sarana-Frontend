import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

interface Props {
  form: any;
}

const PaymentForm: React.FC<Props> = ({ form }) => {

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Customer Name"
            name="customer_name"
            rules={[{ required: true, message: "Please input Customer" }]}
          >
            <Input placeholder="Enter customer_name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Item"
            name="item_name"
            rules={[{ required: true, message: "Please input Item" }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Qty"
            name="qty"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber placeholder="Enter qty" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Unit Price"
            name="unit_price"
            rules={[{ required: true, message: "Please enter unit price" }]}
          >
            <InputNumber placeholder="Enter unit price" precision={2} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Total Amount"
            name="total_amount"
            rules={[{ required: true, message: "Please enter total amount" }]}
          >
            <InputNumber placeholder="Enter total amount" precision={2} style={{ width: '100%' }} />
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
            label="Date"
            name="payment_date"
            rules={[{ required: true, message: "Please enter purchase date" }]}
          >
            <DatePicker
              placeholder="Enter purchase date"
              showTime
              format="YYYY-MMMM-DD HH:mm:ss"
              style={{ width: '100%' }}
              disabled={true}
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
              <Select.Option value="1">Complete</Select.Option>
              <Select.Option value="2">Pending</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Note"
            name="note"
          >
            <TextArea placeholder="Enter note" />
          </Form.Item>
        </Col>
      </Row>
    </Form>

  );
};

export default PaymentForm;
