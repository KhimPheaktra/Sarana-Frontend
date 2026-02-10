import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";

interface Props {
  form: any;
}

const QuoteForm: React.FC<Props> = ({ form}) => {

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
    <Row gutter={16}>
        <Col xs={24} sm={12}>
        <Form.Item
          label="Item"
          name="item"
           rules={[{ required: true, message: "Please enter item" }]}
        >
          <Input placeholder="Enter Item" />
        </Form.Item>
      </Col>
        <Col xs={24} sm={12}>
        <Form.Item
          label="Quote To"
          name="quote_to"
           rules={[{ required: true, message: "Please enter quote request..." }]}
        >
          <Input placeholder="Enter quote request" />
        </Form.Item>
      </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Date"
            name="quote_date"
            rules={[{ required: true, message: "Please enter Quote date" }]}
          >
            <DatePicker 
              placeholder="Enter quote date"
              showTime
              format="YYYY-MM-DD HH:mm:ss" 
              style={{ width: '100%' }}
              disabled={true}
            />
          </Form.Item>
        </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Total"
          name="total_amount"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber placeholder="Enter total amount" precision={2} style={{ width: '100%' }}/>
        </Form.Item>
      </Col>
      

         <Col xs={24} sm={12}>
        <Form.Item
          label="Status"
          name="status"
        //   rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="1">Approved</Select.Option>
            <Select.Option value="2">Pendding</Select.Option>
            <Select.Option value="3">Denied</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Note"
          name="notes"
        >
        <Input placeholder="Enter note" />
        </Form.Item>
      </Col>
    </Row>
  </Form>

  );
};

export default QuoteForm;
