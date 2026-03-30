import { Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
}

const UserForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation("user");

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("user.name")}
            name="username"
            rules={[{ required: true, message: t("validation.nameRequired") }]}
          >
            <Input placeholder={t("placeholder.name")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("user.role")}
            name="role"
            rules={[{ required: true, message: t("validation.roleRequired") }]}
          >
            <Select placeholder={t("placeholder.selectRole")}>
              <Select.Option value="1">{t("role.admin")}</Select.Option>
              <Select.Option value="2">{t("role.engineer")}</Select.Option>
              <Select.Option value="3">{t("role.user")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("user.phone")}
            name="phone_number"
            rules={[{ required: true, message: t("validation.phoneRequired") }]}
          >
            <Input placeholder={t("placeholder.phone")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("user.status")}
            name="status"
            rules={[{ required: true, message: t("validation.statusRequired") }]}
          >
            <Select placeholder={t("placeholder.selectStatus")}>
              <Select.Option value="active">{t("status.active")}</Select.Option>
              <Select.Option value="inactive">{t("status.inactive")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;