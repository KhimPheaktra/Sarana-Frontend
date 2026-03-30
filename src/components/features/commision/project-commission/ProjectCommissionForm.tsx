import React from "react";
import { Button, Col, DatePicker, Form, InputNumber, Row, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  lockedFields?: ("engineer" | "invoice_id" | "project" | "invoice_total")[];
}

const ProjectCommissionForm: React.FC<Props> = ({ form, lockedFields = [] }) => {
  const { t } = useTranslation("commission");
  const isLocked = (field: string) => lockedFields.includes(field as any);

  const handleRateOrTotalChange = () => {
    const rate: number = form.getFieldValue("commission_rate") ?? 0;
    const total: number = form.getFieldValue("invoice_total") ?? 0;
    form.setFieldValue("amount", parseFloat(((total * rate) / 100).toFixed(2)));
  };

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Form.Item name="invoice_id" hidden>
        <InputNumber />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.engineer")}
            name="engineer"
            rules={[{ required: true, message: t("validation.engineerRequired") }]}
          >
            <Select placeholder={t("placeholder.selectEngineer")} disabled={isLocked("engineer")}>
              <Select.Option value="Tra">Tra</Select.Option>
              <Select.Option value="Long">Long</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.date")}
            name="commission_date"
            rules={[{ required: true, message: t("validation.dateRequired") }]}
          >
            <DatePicker
              placeholder={t("placeholder.commissionDate")}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.invoiceTotal")}
            name="invoice_total"
            rules={[{ required: true, message: t("validation.invoiceTotalRequired") }]}
          >
            <InputNumber
              placeholder={t("placeholder.invoiceTotal")}
              precision={2}
              style={{ width: "100%" }}
              disabled={isLocked("invoice_total")}
              onChange={handleRateOrTotalChange}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.commissionRate")}
            name="commission_rate"
            rules={[
              { required: true, message: t("validation.commissionRateRequired") },
              { type: "number", min: 0, max: 100, message: t("validation.commissionRateRange") },
            ]}
          >
            <InputNumber
              placeholder={t("placeholder.commissionRate")}
              min={0}
              max={100}
              precision={1}
              style={{ width: "100%" }}
              onChange={handleRateOrTotalChange}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.amount")}
            name="amount"
            rules={[{ required: true, message: t("validation.amountRequired") }]}
            tooltip={t("tooltip.amountAutoCalc")}
          >
            <InputNumber
              placeholder={t("placeholder.amount")}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.status")}
            name="status"
            rules={[{ required: true, message: t("validation.statusRequired") }]}
          >
            <Select placeholder={t("placeholder.selectStatus")}>
              <Select.Option value="Pending">{t("status.pending")}</Select.Option>
              <Select.Option value="Paid">{t("status.paid")}</Select.Option>
              <Select.Option value="Cancelled">{t("status.cancelled")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t("commission.project")} name="project">
            <TextArea
              placeholder={t("placeholder.project")}
              disabled={isLocked("project")}
              autoSize={{ minRows: 2 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t("commission.description")} name="description">
            <TextArea placeholder={t("placeholder.description")} autoSize={{ minRows: 2 }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("commission.attachPayment")}
            name="payment_detail"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          >
            <Upload accept="image/*" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>{t("button.attachPayment")}</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ProjectCommissionForm;