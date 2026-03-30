import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { catalogItemsData } from "../catalogItem/CatalogItem";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
}

const PaymentForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation(["payment", "common"]);

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

  const handleItemSelect = (value: number, name: number) => {
    const selected = catalogItemsData.find((item) => item.item_id === value);
    const rows = form.getFieldValue("payments") ?? [];
    if (!selected) return;
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
            label={t("payment.party", { ns: "payment" })}
            style={{ marginBottom: 0 }}
          >
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="partyType"
                  noStyle
                  initialValue="customer"
                >
                  <Select>
                    <Select.Option value="customer">{t("payment.customerName", { ns: "payment" })}</Select.Option>
                    <Select.Option value="supplier">{t("payment.supplierName", { ns: "payment" })}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="party_name"
                  noStyle
                  rules={[{ required: true, message: t("validation.customerRequired", { ns: "payment" }) }]}
                >
                  <Input placeholder={t("placeholder.partyName", { ns: "payment" })} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label={t("payment.reference", { ns: "payment" })} name="reference_id">
            <Input placeholder={t("placeholder.reference", { ns: "payment" })} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="engineer" label={t("payment.engineer", { ns: "payment" })}>
            <Select allowClear placeholder={t("placeholder.selectEngineer", { ns: "payment" })}>
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
                        label={t("payment.item", { ns: "payment" })}
                        rules={[{ required: true, message: t("validation.required", { ns: "payment" }) }]}
                      >
                        <Select
                          showSearch
                          placeholder={t("placeholder.searchItem", { ns: "payment" })}
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
                              <span>{option.data.label}</span>
                              <span style={{ color: "#aaa", fontSize: 12 }}>${option.data.price}</span>
                            </div>
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "qty"]}
                        label={t("payment.qty", { ns: "payment" })}
                        rules={[{ required: true, message: t("validation.required", { ns: "payment" }) }]}
                      >
                        <InputNumber min={1} style={{ width: "100%" }} onChange={() => calcAmount(name)} />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit_price"]}
                        label={t("payment.unitPrice", { ns: "payment" })}
                        rules={[{ required: true, message: t("validation.required", { ns: "payment" }) }]}
                      >
                        <InputNumber min={0} style={{ width: "100%" }} prefix="$" onChange={() => calcAmount(name)} />
                      </Form.Item>
                    </Col>
                    <Col xs={6} sm={5}>
                      <Form.Item {...restField} name={[name, "amount"]} label={t("payment.amount", { ns: "payment" })}>
                        <InputNumber min={0} style={{ width: "100%" }} prefix="$" readOnly variant="filled" />
                      </Form.Item>
                    </Col>
                    <Col xs={2} sm={2} style={{ paddingTop: 4 }}>
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => { remove(name); setTimeout(recalcTotal, 0); }}
                        disabled={fields.length === 1}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => { add({ item_name: "", qty: 1, unit_price: 0, amount: 0 }); setTimeout(recalcTotal, 0); }}
                icon={<PlusOutlined />}
                style={{ width: "100%", marginBottom: 12 }}
              >
                {t("button.addItem", { ns: "payment" })}
              </Button>
            </>
          )}
        </Form.List>
      </div>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item label={t("payment.totalAmount", { ns: "payment" })} name="total_amount">
            <InputNumber min={0} precision={2} prefix="$" style={{ width: "100%" }} readOnly variant="filled" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="discount" label={t("payment.discount", { ns: "payment" })}>
            <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            label={t("payment.paymentType", { ns: "payment" })}
            name="payment_type"
            rules={[{ required: true, message: t("validation.required", { ns: "payment" }) }]}
          >
            <Select placeholder={t("placeholder.selectPaymentType", { ns: "payment" })}>
              <Select.Option value="Cash">{t("paymentType.cash", { ns: "payment" })}</Select.Option>
              <Select.Option value="Credit Card">{t("paymentType.creditCard", { ns: "payment" })}</Select.Option>
              <Select.Option value="Bakor">{t("paymentType.bakor", { ns: "payment" })}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={6}>
          <Form.Item
            label={t("payment.date", { ns: "payment" })}
            name="payment_date"
            rules={[{ required: true, message: t("validation.required", { ns: "payment" }) }]}
          >
            <DatePicker
              placeholder={t("placeholder.selectDate", { ns: "payment" })}
              format="YYYY-MM-DD HH:mm:ss"
              disabled={true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item
            label={t("payment.status", { ns: "payment" })}
            name="status"
            initialValue={"Pending"}
            rules={[{ required: true, message: t("validation.required", { ns: "payment" }) }]}
          >
            <Select placeholder={t("status.selectStatus", { ns: "payment" })} >
              <Select.Option value="Completed">{t("status.completed", { ns: "payment" })}</Select.Option>
              <Select.Option value="Pending">{t("status.pending", { ns: "payment" })}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label={t("payment.note", { ns: "payment" })} name="note">
            <TextArea rows={1} placeholder={t("placeholder.note", { ns: "payment" })} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item
            label={t("payment.attachPayment", { ns: "payment" })}
            name="payment_detail"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          >
            <Upload accept="image/*" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>{t("payment.attachPayment", { ns: "payment" })}</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PaymentForm;