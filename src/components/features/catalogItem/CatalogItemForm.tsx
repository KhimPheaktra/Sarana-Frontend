import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
}

const CatalogItemForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation("catalogItem");

  return (
    <Form form={form} layout="vertical" requiredMark={false} initialValues={{ price: 0, purchase_price: 0 }}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("catalogItem.itemType")}
            name="item_type"
            rules={[{ required: true, message: t("validation.itemTypeRequired") }]}
          >
            <Input placeholder={t("placeholder.itemType")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("catalogItem.name")}
            name="name"
            rules={[{ required: true, message: t("validation.nameRequired") }]}
          >
            <Input placeholder={t("placeholder.name")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("catalogItem.price")}
            name="price"
            rules={[{ required: true, message: t("validation.priceRequired") }]}
          >
            <InputNumber
              placeholder={t("placeholder.price")}
              min={0}
              prefix="$"
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("catalogItem.purchasePrice")}
            name="purchase_price"
            rules={[{ required: true, message: t("validation.purchasePriceRequired") }]}
          >
            <InputNumber
              placeholder={t("placeholder.purchasePrice")}
              min={0}
              prefix="$"
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("catalogItem.stockQuantity")}
            name="stock_quantity"
            rules={[{ required: true, message: t("validation.stockQuantityRequired") }]}
          >
            <InputNumber placeholder={t("placeholder.stockQuantity")} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("table.status")}
            name="is_active"
            initialValue={true}
            rules={[{ required: true, message: t("validation.statusRequired") }]}
          >
            <Select placeholder={t("status.selectStatus")}>
              <Select.Option value={true}>{t("status.active")}</Select.Option>
              <Select.Option value={false}>{t("status.inactive")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("catalogItem.description")}
            name="description"
          >
            <TextArea placeholder={t("placeholder.description")} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CatalogItemForm;