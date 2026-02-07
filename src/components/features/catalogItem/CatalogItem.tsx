import { Card, Form, message } from "antd";
import type { CatalogItemType } from "./catalogItem.types";
import PageHeader from "../../layout/pageHeader/PageHeader";
import { TagsOutlined } from "@ant-design/icons";
import CatalogItemTable from "./CatalogItemTable";
import CatalogItemForm from "./CatalogItemForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";


const CatalogItem = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const catalogItems: CatalogItemType[] = [
    { key: "1", item_id: 1, item_type: "Electronics", name: "Laptop", description: "A high-performance laptop", price: 1200, purchase_price: 1000, stock_quantity: 10, is_active: true },
    { key: "2", item_id: 2, item_type: "Furniture", name: "Chair", description: "A comfortable office chair", price: 150, purchase_price: 120, stock_quantity: 25, is_active: true },
    { key: "3", item_id: 3, item_type: "Appliances", name: "Microwave", description: "A compact microwave oven", price: 200, purchase_price: 150, stock_quantity: 15, is_active: false },
  ];

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
        count={catalogItems.length}
        countLabel="catalog items"
        icon={<TagsOutlined />}
        onAdd={openAdd}
        buttonText="Add Item"
      />

      <Card>
        <CatalogItemTable
          data={catalogItems}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default CatalogItem;
