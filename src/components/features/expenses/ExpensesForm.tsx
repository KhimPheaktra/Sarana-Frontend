
import { Col, DatePicker, Form, Input, InputNumber, Row } from "antd";

interface Props {
  form: any;
}

const ExpensesForm: React.FC<Props> = ({ form}) => {

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
    <Row gutter={16}>
        <Col xs={24} sm={12}>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter " }]}
        >
          <Input placeholder="Enter description" />
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
            label="Expenses Date"
            name="expenses_date"
            rules={[{ required: true, message: "Please enter purchase date" }]}
          >
            <DatePicker 
              placeholder="Enter purchase date"
              showTime
              format="YYYY-MM-DD HH:mm:ss" 
              style={{ width: '100%' }}
              disabled={true}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter Category" }]}
        >
          <Input placeholder="Enter Category" />
        </Form.Item>
      </Col>
     
    </Row>
  </Form>

  );
};

export default ExpensesForm;
