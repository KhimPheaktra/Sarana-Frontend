import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Divider, Form, InputNumber, message, Modal, Row, Select, Upload } from "antd";
import type { FormInstance } from "antd/es/form";
import type { ModalMode } from "../../../shared/modal/AppModal";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { catalogItemsData } from "../catalogItem/CatalogItem";
import CatalogItemForm from "../catalogItem/CatalogItemForm";

interface Props {
  form: FormInstance<any>;
  mode?: ModalMode;
}

const PurchaseForm: React.FC<Props> = ({ form, mode = "add" }) => {
  const isView = mode === "view";
  const [quickForm] = Form.useForm();
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [activeRowName, setActiveRowName] = useState<number | null>(null);
  const [localCatalog, setLocalCatalog] = useState([...catalogItemsData]);

  const calcSubtotal = (name: number) => {
    const qty   = form.getFieldValue(["items", name, "qty"])        || 0;
    const price = form.getFieldValue(["items", name, "unit_price"]) || 0;
    form.setFieldValue(["items", name, "subtotal"], qty * price);
    recalcTotal();
  };

  const recalcTotal = () => {
    const items = form.getFieldValue("items") || [];
    const total = items.reduce((sum: number, row: any) => sum + (row?.subtotal || 0), 0);
    form.setFieldsValue({ total_amount: total });
  };


  const handleItemSelect = (value: number, name: number) => {
    const selected = localCatalog.find((item) => item.item_id === value);
    if (!selected) return;

    const unitPrice = selected.purchase_price ?? selected.price;
    const rows = form.getFieldValue("items") ?? [];
    rows[name] = {
      ...rows[name],
      item_name:  selected.item_id,       
      unit_price: unitPrice,
      subtotal:   (rows[name]?.qty || 1) * unitPrice,
    };
    form.setFieldsValue({ items: rows });
    recalcTotal();
  };

  const handleQuickAdd = async () => {
    try {
      const v = await quickForm.validateFields();

      const newItem = {
        key:            String(localCatalog.length + 1),
        item_id:        localCatalog.length + 1,
        item_type:      v.item_type,
        name:           v.name,
        price:          Number(v.price),
        purchase_price: Number(v.purchase_price ?? v.price),
        stock_quantity: Number(v.stock_quantity ?? 0),
        is_active:      true,
        description:    v.description ?? "",
      };
      catalogItemsData.push(newItem);
      setLocalCatalog([...catalogItemsData]);

      if (activeRowName !== null) {
        const rows = form.getFieldValue("items") ?? [];
        rows[activeRowName] = {
          ...rows[activeRowName],
          item_name:  newItem.item_id,
          unit_price: newItem.purchase_price,
          subtotal:   (rows[activeRowName]?.qty || 1) * newItem.purchase_price,
        };
        form.setFieldsValue({ items: rows });
        recalcTotal();
      }

      setQuickModalOpen(false);
      quickForm.resetFields();
    } catch {
      message.error("Failed to add new item")
    }
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
          <Form.Item label="Purchase Date" name="purchase_date">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD HH:mm:ss" disabled />
          </Form.Item>
        </Col>
      </Row>

      {/* Item rows */}
      <div style={{ maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
        <Form.List
          name="items"
          initialValue={[{ item_name: undefined, qty: 1, unit_price: 0, subtotal: 0 }]}
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

                    {/* Item selector with + New Item footer */}
                    <Col xs={24} sm={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "item_name"]}
                        label="Item"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Search item..."
                          optionFilterProp="label"
                          disabled={isView}
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(value) => handleItemSelect(value, name)}
                          options={localCatalog
                            .filter((i) => i.is_active)
                            .map((item) => ({
                              value: item.item_id,
                              label: item.name,
                              price: item.purchase_price ?? item.price,
                            }))}
                          optionRender={(option) => (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{option.label}</span>
                              <span style={{ color: "#aaa", fontSize: 12 }}>
                                ${option.data.price}
                              </span>
                            </div>
                          )}
                          popupRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: "4px 0" }} />
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                style={{ width: "100%", textAlign: "left", padding: "4px 12px" }}
                                onMouseDown={(e) => e.preventDefault()} 
                                onClick={() => {
                                  setActiveRowName(name);
                                  quickForm.resetFields();
                                  setQuickModalOpen(true);
                                }}
                              >
                                Add New Item
                              </Button>
                            </>
                          )}
                        />
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
                          min={1}
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
                      <Form.Item {...restField} name={[name, "subtotal"]} label="Subtotal">
                        <InputNumber
                          precision={2}
                          prefix="$"
                          style={{ width: "100%" }}
                          readOnly
                          variant="filled"
                        />
                      </Form.Item>
                    </Col>

                    {!isView && (
                      <Col xs={2} sm={2} style={{ paddingTop: 4 }}>
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
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
                  onClick={() => add({ item_name: undefined, qty: 1, unit_price: 0, subtotal: 0 })}
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

      <Row gutter={16}>
        <Col xs={24} sm={6}>
          <Form.Item label="Total Amount" name="total_amount">
            <InputNumber precision={2} prefix="$" style={{ width: "100%" }} readOnly variant="filled" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Note" name="note">
            <TextArea rows={2} placeholder="Optional note / remarks" disabled={isView} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Status" name="status" initialValue="Pending">
            <Select disabled={isView}>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item
            label="Attach Payment"
            name="payment_detail"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          >
            <Upload accept="image/*" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Attach Payment</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      {/* Add Catalog Item Modal */}
      <Modal
        title="Quick Add Catalog Item"
        open={quickModalOpen}
        onCancel={() => { setQuickModalOpen(false); quickForm.resetFields(); }}
        onOk={handleQuickAdd}
        okText="Add & Select"
        width={600}
        destroyOnHidden
      >
        <CatalogItemForm form={quickForm} />
      </Modal>

    </Form>
  );
};

export default PurchaseForm;