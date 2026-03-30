import { Col, DatePicker, Form, Input, InputNumber, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
}

const ExpensesForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation("expenses");

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("expenses.description")}
            name="description"
            rules={[{ required: true, message: t("validation.descriptionRequired") }]}
          >
            <TextArea placeholder={t("placeholder.description")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("expenses.amount")}
            name="amount"
            rules={[{ required: true, message: t("validation.amountRequired") }]}
          >
            <InputNumber placeholder={t("placeholder.amount")} precision={2} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("expenses.expensesDate")}
            name="expenses_date"
            rules={[{ required: true, message: t("validation.expensesDateRequired") }]}
          >
            <DatePicker
              placeholder={t("placeholder.expensesDate")}
              showTime
              format="YYYY-MMMM-DD HH:mm:ss"
              style={{ width: "100%" }}
              disabled={true}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("expenses.category")}
            name="category"
            rules={[{ required: true, message: t("validation.categoryRequired") }]}
          >
            <Input placeholder={t("placeholder.category")} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ExpensesForm;