import React from "react";
import { Col, DatePicker, Form, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

interface Props {
  form: any;
  lockedFields?: ("engineer" | "invoice_id" | "project" | "invoice_total")[];
}

const ProjectCommissionForm: React.FC<Props> = ({ form, lockedFields = [] }) => {
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
            label="Engineer"
            name="engineer"
            rules={[{ required: true, message: "Please select engineer" }]}
          >
            <Select placeholder="Select engineer" disabled={isLocked("engineer")}>
              <Select.Option value="Tra">Tra</Select.Option>
              <Select.Option value="Long">Long</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Date"
            name="commission_date"
            rules={[{ required: true, message: "Please enter commission date" }]}
          >
            <DatePicker
              placeholder="Enter commission date"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Invoice Total ($)"
            name="invoice_total"
            rules={[{ required: true, message: "Invoice total is required" }]}
          >
            <InputNumber
              placeholder="0.00"
              precision={2}
              style={{ width: "100%" }}
              disabled={isLocked("invoice_total")}
              onChange={handleRateOrTotalChange}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Commission Rate (%)"
            name="commission_rate"
            rules={[
              { required: true, message: "Please enter commission rate" },
              { type: "number", min: 0, max: 100, message: "Must be between 0–100" },
            ]}
          >
            <InputNumber
              placeholder="30"
              min={0}
              max={100}
              precision={1}
              addonAfter="%"
              style={{ width: "100%" }}
              onChange={handleRateOrTotalChange}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter amount" }]}
            tooltip="Auto-calculated from Invoice Total × Rate. You can override manually."
          >
            <InputNumber
              placeholder="Enter amount"
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Paid">Paid</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Project" name="project">
            <TextArea
              placeholder="Enter project"
              disabled={isLocked("project")}
              autoSize={{ minRows: 2 }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Description" name="description">
            <TextArea placeholder="Enter description" autoSize={{ minRows: 2 }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ProjectCommissionForm;