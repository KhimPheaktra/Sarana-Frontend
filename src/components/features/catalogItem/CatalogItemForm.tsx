import { Col, Form, Input, InputNumber, Row, Select } from "antd";

interface Props {
  form: any;
}

const CatalogItemForm: React.FC<Props> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" requiredMark={false}>
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Item Type"
          name="item_type"
          rules={[{ required: true, message: "Please enter item type" }]}
        >
          <Input placeholder="Enter item type" />
        </Form.Item>
      </Col>
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
          label="Description"
          name="description"
        >
          <Input placeholder="Enter email" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber placeholder="Enter price" precision={2} style={{ width: '100%' }}/>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Purchase Price"
          name="purchase_price"
          rules={[{ required: true, message: "Please enter purchase price" }]}
        >
          <InputNumber placeholder="Enter purchase price" precision={2} style={{ width: '100%' }}/>
        </Form.Item>
      </Col>
        <Col xs={24} sm={12}>
        <Form.Item
          label="Stock Quantity"
          name="stock_quantity"
          rules={[{ required: true, message: "Please enter stock quantity" }]}
        >
          <InputNumber placeholder="Enter stock quantity" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Status"
          name="is_active"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    
      


     
    </Row>
  </Form>

  );
};

export default CatalogItemForm;
