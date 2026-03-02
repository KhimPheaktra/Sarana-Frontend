import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface Props {
  form: any;
}

const QuoteForm: React.FC<Props> = ({ form }) => {
  const calculateAmount = (index: number) => {
    const items = form.getFieldValue("items") || [];

    const row = items[index];

    const updatedItems = [...items];

    updatedItems[index] = {
      ...row,
      amount: (row?.qty || 0) * (row?.unit_price || 0),
    };

    form.setFieldsValue({ items: updatedItems });
  };
  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="quote_to" label="Quote To" rules={[{ required: true }]}>
            <Input placeholder="Customer name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="quote_date" label="Quote Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      {/* Dynamic Items */}
      <Form.List name="items" initialValue={[{ item: "", qty: 1, unit: "PCs", unit_price: 0, amount: 0 }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  border: "1px dashed #d9d9d9",
                  borderRadius: 8,
                  padding: "12px 12px 0",
                  marginBottom: 12,
                  position: "relative",
                  background: "#fafafa",
                }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                    disabled={fields.length === 1}
                  />
                </div>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      name={[name, "item"]}
                      label="Description"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Input placeholder="Item description" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item
                      {...restField}
                      name={[name, "qty"]}
                      label="Qty"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        onChange={() => calculateAmount(name)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item
                      {...restField}
                      name={[name, "unit"]}
                      label="Unit"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Select>
                        <Select.Option value="PCs">PCs</Select.Option>
                        <Select.Option value="SET">SET</Select.Option>
                        <Select.Option value="LOT">LOT</Select.Option>
                        <Select.Option value="HR">HR</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "unit_price"]}
                      label="Unit Price ($)"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        prefix="$"
                        onChange={() => calculateAmount(name)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                      label="Amount ($)"
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        prefix="$"
                        readOnly
                        variant="filled"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}

            <Button
              type="dashed"
              onClick={() => add({ item: "", qty: 1, unit: "PCs", unit_price: 0, amount: 0 })}
              icon={<PlusOutlined />}
              block
              style={{ marginBottom: 16 }}
            >
              Add Item
            </Button>
          </>
        )}
      </Form.List>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="discount" label="Discount ($)">
            <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="engineer" label="Engineer">
            <Select allowClear placeholder="Select engineer">
              <Select.Option value="Tra">Tra</Select.Option>
              <Select.Option value="Long">Long</Select.Option>
              <Select.Option value="Som">Som</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Denied">Denied</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default QuoteForm;