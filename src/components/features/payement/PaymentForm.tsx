import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

interface Props {
  form: any;
}

const PaymentForm: React.FC<Props> = ({ form }) => {
const calcAmount = (name: number) => {
  const qty = form.getFieldValue(["payments", name, "qty"]) || 0;
  const price = form.getFieldValue(["payments", name, "unit_price"]) || 0;
  form.setFieldValue(["payments", name, "amount"], qty * price);
  recalcTotal();
};

  const recalcTotal = () => {
    const items = form.getFieldValue("payments") ?? [];
    const total = items.reduce((sum: number, row: any) => sum + (row?.amount || 0), 0);
    form.setFieldsValue({ total_amount: total });
  };

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Customer Name" name="customer_name"
            rules={[{ required: true, message: "Please input Customer" }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Reference" name="reference_id">
            <Input placeholder="Reference" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="engineer" label="Engineer">
            <Select allowClear placeholder="Select engineer">
              <Select.Option value="Tra">Tra</Select.Option>
              <Select.Option value="Long">Long</Select.Option>
              <Select.Option value="Som">Som</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <div style={{ maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
        <Form.List name="payments" initialValue={[{ item_name: "", qty: 1, unit_price: 0, amount: 0 }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{
                  border: "1px dashed #d9d9d9",
                  borderRadius: 8,
                  padding: "8px 12px 0",
                  marginBottom: 8,
                  background: "#fafafa",
                }}>
                  <Row gutter={8} align="middle">
                    <Col xs={24} sm={8}>
                      <Form.Item {...restField} name={[name, "item_name"]} label="Item"
                        rules={[{ required: true, message: "Required" }]}>
                        <Input placeholder="Item name" />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={4}>
                      <Form.Item {...restField} name={[name, "qty"]} label="Qty"
                        rules={[{ required: true, message: "Required" }]}>
                        <InputNumber min={1} style={{ width: "100%" }}
                          onChange={() => calcAmount(name)} />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={5}>
                      <Form.Item {...restField} name={[name, "unit_price"]} label="Unit Price"
                        rules={[{ required: true, message: "Required" }]}>
                        <InputNumber min={0} style={{ width: "100%" }} prefix="$"
                          onChange={() => calcAmount(name)} />
                      </Form.Item>
                    </Col>
                    <Col xs={6} sm={5}>
                      <Form.Item {...restField} name={[name, "amount"]} label="Amount">
                        <InputNumber min={0} style={{ width: "100%" }} prefix="$"
                          readOnly variant="filled" />
                      </Form.Item>
                    </Col>
                    <Col xs={2} sm={2} style={{ paddingTop: 4 }}>
                      <Button danger type="text" icon={<DeleteOutlined />}
                        onClick={() => { remove(name); setTimeout(recalcTotal, 0); }}
                        disabled={fields.length === 1}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              <Button type="dashed" onClick={() => {
                add({ item_name: "", qty: 1, unit_price: 0, amount: 0 });
                setTimeout(recalcTotal, 0);
              }} icon={<PlusOutlined />} style={{ width: "100%", marginBottom: 12 }}>
                Add Item
              </Button>
            </>
          )}
        </Form.List>
      </div>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item label="Total Amount" name="total_amount">
            <InputNumber min={0} precision={2} prefix="$" style={{ width: "100%" }}
              readOnly variant="filled" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="discount" label="Discount ($)">
            <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item label="Payment Type" name="payment_type"
            rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select payment type">
              <Select.Option value="Cash">Cash</Select.Option>
              <Select.Option value="Credit Card">Credit Card</Select.Option>
              <Select.Option value="Bakor">Bakor</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item label="Date" name="payment_date"
            rules={[{ required: true, message: "Required" }]}>
            <DatePicker placeholder="Select date" format="YYYY-MM-DD"
              style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item label="Status" name="status"
            rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select status">
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item label="Note" name="note">
            <TextArea rows={1} placeholder="Enter note" />
          </Form.Item>
        </Col>
      </Row>

    </Form>
  );
};
export default PaymentForm;