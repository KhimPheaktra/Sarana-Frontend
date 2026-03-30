import { Card, Form, message } from "antd";
import type { CatalogItemType } from "./catalogItem.types";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import { TagsOutlined } from "@ant-design/icons";
import CatalogItemTable from "./CatalogItemTable";
import CatalogItemForm from "./CatalogItemForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useTranslation } from "react-i18next";


export const catalogItemsData: CatalogItemType[] = [
  { key: "1", item_id: 1, item_type: "Item", name: "Meterial", description: "120mm", price: 15, purchase_price: 10, stock_quantity: 10, is_active: true },
  { key: "2", item_id: 2, item_type: "Service", name: "Fire Service", description: "Fire Service", price: 150, purchase_price: 120, stock_quantity: 0, is_active: true },
  { key: "3", item_id: 3, item_type: "Service", name: "Electrice Service", description: "Electrice Service", price: 200, purchase_price: 150, stock_quantity: 0, is_active: false },
];
const CatalogItem = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();


  const titleMap = {
    add: t("modal.addTitle", { name: t("title.item") }),
    edit: t("modal.editTitle", { name: t("title.item") }),
    delete: t("modal.deleteTitle", { name: t("title.item") }),
  };
  const okTextMap = {
    add: t("modal.okText"),
    edit: t("modal.okText"),
    delete: t("modal.deleteOkText"),
  };
  const openAdd = () => {
    form.resetFields();
    openModal("add", {
      titleMap,
      okTextMap,
      content: <CatalogItemForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        message.success("Item added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (item: CatalogItemType) => {
    form.setFieldsValue(item);
    openModal("edit", {
      titleMap,
      okTextMap,
      content: <CatalogItemForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        message.success("Item updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (item: CatalogItemType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: (
        <p>
          Are you sure you want to delete <b>{item.name}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Item deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <ActionHeader
        title={t("title.item", { ns: "common" })}
        count={catalogItemsData.length}
        countLabel={t("title.item", { ns: "common" })}
        icon={<TagsOutlined />}
        onAdd={openAdd}
        buttonText={t("button.add", { ns: "common" })}
      />

      <Card>
        <CatalogItemTable
          data={catalogItemsData}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default CatalogItem;
