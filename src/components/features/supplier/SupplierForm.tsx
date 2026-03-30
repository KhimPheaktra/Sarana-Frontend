import { Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
}

const SupplierForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation("supplier");

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("supplier.name")}
            name="name"
            rules={[{ required: true, message: t("validation.nameRequired") }]}
          >
            <Input placeholder={t("placeholder.name")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("supplier.phone")}
            name="phone_number"
            rules={[{ required: true, message: t("validation.phoneRequired") }]}
          >
            <Input placeholder={t("placeholder.phone")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("supplier.email")}
            name="email"
            rules={[{ required: true, message: t("validation.emailRequired") }]}
          >
            <Input placeholder={t("placeholder.email")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("supplier.address")}
            name="address"
            rules={[{ required: true, message: t("validation.addressRequired") }]}
          >
            <Input placeholder={t("placeholder.address")} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SupplierForm;