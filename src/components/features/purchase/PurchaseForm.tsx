import { Col, DatePicker, Form, InputNumber, Row, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { ModalMode } from "../../../shared/modal/AppModal";

interface Props {
  form: FormInstance<any>;
  mode?: ModalMode;
}

const PurchaseForm: React.FC<Props> = ({ form, mode = "add" }) => {
  const isView = mode === "view"; 

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Supplier"
            name="supplier_id"
            rules={[{ required: true, message: "Please select supplier" }]}
          >
            <Select placeholder="Select supplier" disabled={isView}>
              <Select.Option value="1">Supplier 1</Select.Option>
              <Select.Option value="2">Supplier 2</Select.Option>
              <Select.Option value="3">Supplier 3</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} >
          <Form.Item
            label="Date"
            name="purchase_date"
            rules={[{ required: true, message: "Please enter purchase date" }]}
          >
            <DatePicker
              placeholder="Enter purchase date"
              showTime
              format="YYYY-MMMM-DD HH:mm:ss"
              style={{ width: "100%" }}
              disabled={true}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Catalog Item"
            name="item_id"
            rules={[{ required: true, message: "Please select item" }]}
          >
            <Select placeholder="Select item" disabled={isView}>
              <Select.Option value="1">Item 1</Select.Option>
              <Select.Option value="2">Item 2</Select.Option>
              <Select.Option value="3">Item 3</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber
              placeholder="Enter quantity"
              precision={2}
              style={{ width: "100%" }}
              disabled={isView}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Unit Price"
            name="unit_price"
            rules={[{ required: true, message: "Please enter unit price" }]}
          >
            <InputNumber
              placeholder="Enter unit price"
              precision={2}
              style={{ width: "100%" }}
              disabled={isView}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Subtotal"
            name="subtotal"
            rules={[{ required: true, message: "Please enter subtotal" }]}
          >
            <InputNumber
              placeholder="Enter subtotal"
              precision={2}
              style={{ width: "100%" }}
              disabled={isView}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Total Amount"
            name="total_amount"
            rules={[{ required: true, message: "Please enter total amount" }]}
          >
            <InputNumber
              placeholder="Enter total amount"
              precision={2}
              style={{ width: "100%" }}
              disabled={isView}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PurchaseForm;
