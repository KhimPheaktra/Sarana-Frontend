import { Col, DatePicker, Form, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

interface Props {
    form: any;
}

const CommissionForm: React.FC<Props> = ({ form }) => {

    return (
        <Form form={form} layout="vertical" requiredMark={false}>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Engineer"
                        name="engineer"
                        rules={[{ required: true, message: "Please select engineer" }]}
                    >
                        <Select placeholder="Select engineer">
                            <Select.Option value="1">Tra</Select.Option>
                            <Select.Option value="2">Long</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: "Please enter amount" }]}
                    >
                        <InputNumber placeholder="Enter amount" precision={2} style={{ width: '100%' }} />
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
                            showTime
                            format="YYYY-MMMM-DD HH:mm:ss"
                            style={{ width: '100%' }}
                            disabled={true}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea placeholder="Enter description" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>

    );
};

export default CommissionForm;
