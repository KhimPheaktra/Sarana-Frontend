import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { ModalMode } from "../../../shared/modal/AppModal";
import TextArea from "antd/es/input/TextArea";

interface Props {
  form: FormInstance<any>;
  mode?: ModalMode;
}

const PurchaseForm: React.FC<Props> = ({ form, mode = "add" }) => {
  const isView = mode === "view";

  const calcSubtotal = (name: number) => {
  const qty = form.getFieldValue(["items", name, "qty"]) || 0;
  const price = form.getFieldValue(["items", name, "unit_price"]) || 0;

  form.setFieldValue(["items", name, "subtotal"], qty * price);
  recalcTotal();
};

  const recalcTotal = () => {
    const items = form.getFieldValue("items") || [];
    const total = items.reduce((sum: number, row: any) => sum + (row?.subtotal || 0), 0);
    form.setFieldsValue({ total_amount: total });
  };

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
              <Select.Option value={1}>Supplier 1</Select.Option>
              <Select.Option value={2}>Supplier 2</Select.Option>
              <Select.Option value={3}>Supplier 3</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Purchase Date"
            name="purchase_date"
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabled={true}
            />
          </Form.Item>
        </Col>
      </Row>
     <div style={{ maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
        <Form.List
          name="items"
          initialValue={[{ item_name:"", qty: 1, unit_price: 0, subtotal: 0 }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    border: "1px dashed #d9d9d9",
                    borderRadius: 8,
                    padding: "8px 12px 0",
                    marginBottom: 8,
                    background: "#fafafa",
                  }}
                >
                  <Row gutter={8} align="middle">
                    <Col xs={24} sm={9}>
                      <Form.Item
                        {...restField}
                        name={[name, "item_name"]}
                        label="Catalog Item"
                        rules={[{ required: true, message: "Required" }]}
                      >
                    <Input placeholder="Enter Item Name" />
                      </Form.Item>
                    </Col>

                    <Col xs={8} sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "qty"]}
                        label="Quantity"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          disabled={isView}
                          onChange={() => calcSubtotal(name)}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={8} sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit_price"]}
                        label="Unit Price"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber
                          min={0}
                          precision={2}
                          prefix="$"
                          style={{ width: "100%" }}
                          disabled={isView}
                          onChange={() => calcSubtotal(name)}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={6} sm={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "subtotal"]}
                        label="Subtotal"
                      >
                        <InputNumber
                          precision={2}
                          prefix="$"
                          style={{ width: "100%" }}
                          readOnly
                          variant="filled"
                          disabled={isView}
                        />
                      </Form.Item>
                    </Col>

                    {!isView && (
                      <Col xs={2} sm={2} style={{ paddingTop: 4 }}>
                      <Button danger type="text" icon={<DeleteOutlined />}
                        onClick={() => { remove(name); setTimeout(recalcTotal, 0); }}
                        disabled={fields.length === 1}
                      />
                    </Col>
                    )}
                  </Row>
                </div>
              ))}

              {!isView && (
                <Button
                  type="dashed"
                  onClick={() => {
                    add({ item_name: "", qty: 1, unit_price: 0, subtotal: 0 });
                    setTimeout(recalcTotal, 0);
                  }}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  Add Item
                </Button>
              )}
            </>
          )}
        </Form.List>
      </div>

      {/* Totals + extras */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item label="Total Amount" name="total_amount">
            <InputNumber
              precision={2}
              prefix="$"
              style={{ width: "100%" }}
              readOnly
              variant="filled"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item label="Note" name="note">
            <TextArea rows={2} placeholder="Optional note / remarks" disabled={isView} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item label="Status" name="status" initialValue="Pending">
            <Select disabled={isView}>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PurchaseForm;