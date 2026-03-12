import { Card, Form, message } from "antd";
import type { CatalogItemType } from "./catalogItem.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { TagsOutlined } from "@ant-design/icons";
import CatalogItemTable from "./CatalogItemTable";
import CatalogItemForm from "./CatalogItemForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";

export const catalogItemsData: CatalogItemType[] = [
    { key: "1", item_id: 1, item_type: "Item", name: "Meterial", description: "120mm", price: 15, purchase_price: 10, stock_quantity: 10, is_active: true },
    { key: "2", item_id: 2, item_type: "Service", name: "Fire Service", description: "Fire Service", price: 150, purchase_price: 120, stock_quantity: 0, is_active: true },
    { key: "3", item_id: 3, item_type: "Service", name: "Electrice Service", description: "Electrice Service", price: 200, purchase_price: 150, stock_quantity: 0, is_active: false },
  ];
const CatalogItem = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();


  const titleMap = {
    add: "Add Catalog Item",
    edit: "Edit Catalog Item",
    delete: "Delete Catalog Item",
  };

  const openAdd = () => {
    form.resetFields();
    openModal("add", {
      titleMap,
      content: <CatalogItemForm form={form} />,
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
      content: <CatalogItemForm form={form} />,
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
      <PageHeader
        title="Catalog Item Management"
        count={catalogItemsData.length}
        countLabel="catalog items"
        icon={<TagsOutlined />}
        onAdd={openAdd}
        buttonText="Add Item"
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
