import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { catalogItemsData } from "../catalogItem/CatalogItem";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
}

const InvoiceForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation("invoice");

  const calcAmount = (name: number) => {
    const qty = form.getFieldValue(["invoices", name, "qty"]) || 0;
    const price = form.getFieldValue(["invoices", name, "unit_price"]) || 0;
    form.setFieldValue(["invoices", name, "amount"], qty * price);
    recalcTotal();
  };

  const recalcTotal = () => {
    const items = form.getFieldValue("invoices") ?? [];
    const total = items.reduce((sum: number, row: any) => sum + (row?.amount || 0), 0);
    form.setFieldsValue({ total_amount: total });
  };

  const handleItemSelect = (value: number, name: number) => {
    const selected = catalogItemsData.find((item) => item.item_id === value);
    if (!selected) return;

    const rows = form.getFieldValue("invoices") ?? [];
    rows[name] = {
      ...rows[name],
      item_name: selected.name,
      unit_price: selected.price,
      amount: (rows[name]?.qty || 1) * selected.price,
    };
    form.setFieldsValue({ invoices: rows });
    recalcTotal();
  };

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("invoice.customerName")}
            name="customer_name"
            rules={[{ required: true, message: t("placeholder.customer") }]}
          >
            <Input placeholder={t("placeholder.customer")} />
          </Form.Item>
        </Col>

        {/* <Col xs={24} sm={6}>
          <Form.Item label={t("invoice.reference")} name="reference_id">
            <Input placeholder={t("placeholder.reference")} />
          </Form.Item>
        </Col> */}

        <Col xs={24} sm={6}>
          <Form.Item name="engineer" label={t("invoice.engineer")}>
            <Select allowClear placeholder={t("placeholder.selectEngineer")}>
              <Select.Option value="Tra">Tra</Select.Option>
              <Select.Option value="Long">Long</Select.Option>
              <Select.Option value="Som">Som</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <div style={{ maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
        <Form.List name="invoices" initialValue={[{ item_name: undefined, qty: 1, unit_price: 0, amount: 0 }]}>
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
                    <Col xs={24} sm={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "item_name"]}
                        label={t("invoice.item")}
                        rules={[{ required: true, message: t("validation.required") || "Required" }]}
                      >
                        <Select
                          showSearch
                          placeholder={t("placeholder.searchItem")}
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(value) => handleItemSelect(value, name)}
                          options={catalogItemsData
                            .filter((i) => i.is_active)
                            .map((item) => ({
                              value: item.item_id,
                              label: item.name,
                              price: item.price,
                            }))}
                          optionRender={(option) => (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{option.label}</span>
                              <span style={{ color: "#aaa", fontSize: 12 }}>
                                ${option.data.price}
                              </span>
                            </div>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={8} sm={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "qty"]}
                        label={t("invoice.qty")}
                        rules={[{ required: true, message: t("validation.required") || "Required" }]}
                      >
                        <InputNumber min={1} style={{ width: "100%" }} onChange={() => calcAmount(name)} />
                      </Form.Item>
                    </Col>

                    <Col xs={8} sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit_price"]}
                        label={t("invoice.unitPrice")}
                        rules={[{ required: true, message: t("validation.required") || "Required" }]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          prefix="$"
                          onChange={() => calcAmount(name)}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={6} sm={5}>
                      <Form.Item {...restField} name={[name, "amount"]} label={t("invoice.amount")}>
                        <InputNumber min={0} style={{ width: "100%" }} prefix="$" readOnly variant="filled" />
                      </Form.Item>
                    </Col>

                    <Col xs={2} sm={2} style={{ paddingTop: 4 }}>
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          remove(name);
                          setTimeout(recalcTotal, 0);
                        }}
                        disabled={fields.length === 1}
                      />
                    </Col>
                  </Row>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add({ item_name: undefined, qty: 1, unit_price: 0, amount: 0 })}
                icon={<PlusOutlined />}
                style={{ width: "100%", marginBottom: 12 }}
              >
                {t("invoice.addItem")}
              </Button>
            </>
          )}
        </Form.List>
      </div>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item label={t("invoice.totalAmount")} name="total_amount">
            <InputNumber min={0} precision={2} prefix="$" style={{ width: "100%" }} readOnly variant="filled" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item name="discount" label={t("invoice.discount")}>
            <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item
            label={t("invoice.date")}
            name="invoice_date"
            rules={[{ required: true, message: t("validation.required") || "Required" }]}
          >
            <DatePicker
              placeholder={t("placeholder.selectDate")}
              format="YYYY-MM-DD HH:mm:ss"
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item
            label={t("invoice.status")}
            name="status"
            rules={[{ required: true, message: t("validation.required") || "Required" }]}
            initialValue={"Pending"}
          >
            <Select placeholder={t("status.selectStatus")}>
              <Select.Option value="Pending">{t("status.pending")}</Select.Option>
              <Select.Option value="Completed">{t("status.completed")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item label={t("invoice.note")} name="note">
            <TextArea rows={1} placeholder={t("placeholder.note")} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item
            label={t("invoice.attachPayment")}
            name="payment_detail"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload accept="image/*" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>
                {t("invoice.attachPayment")}
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;