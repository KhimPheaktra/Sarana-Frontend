import { Col, DatePicker, Form, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";

interface Props {
    form: any;
}

const PersonalCommissionForm: React.FC<Props> = ({ form }) => {
    const { t } = useTranslation("commission");

    return (
        <Form form={form} layout="vertical" requiredMark={false}>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label={t("commission.engineer")}
                        name="engineer"
                        rules={[{ required: true, message: t("validation.engineerRequired") }]}
                    >
                        <Select placeholder={t("placeholder.selectEngineer")}>
                            <Select.Option value="1">Tra</Select.Option>
                            <Select.Option value="2">Long</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label={t("commission.amount")}
                        name="amount"
                        rules={[{ required: true, message: t("validation.amountRequired") }]}
                    >
                        <InputNumber placeholder={t("placeholder.amount")} precision={2} style={{ width: "100%" }} />
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
                            showTime
                            format="YYYY-MMMM-DD HH:mm:ss"
                            style={{ width: "100%" }}
                            disabled={true}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label={t("commission.description")}
                        name="description"
                    >
                        <TextArea placeholder={t("placeholder.description")} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default PersonalCommissionForm;