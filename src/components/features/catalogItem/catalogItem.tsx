import { Card, Form, message } from "antd";
import { useState } from "react";
import type { ModalMode, CatalogItemType } from "./catalogItem.types";
import PageHeader from "../../layout/pageHeader/pageHeader";
import {TagsOutlined } from "@ant-design/icons";
import CatalogItemModal from "./catalogItemModal.";
import CatalogItemTable from "./catalogItemTable";


const CatalogItem = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedItem, setSelectedItem] = useState<CatalogItemType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const catalogItems: CatalogItemType[] = [
        { key: "1", item_id: 1, item_type: "Electronics", name: "Laptop", description: "A high-performance laptop", price: 1200,purchase_price:1000, stock_quantity: 10, is_active: true },
        { key: "2", item_id: 2, item_type: "Furniture", name: "Chair", description: "A comfortable office chair", price: 150, purchase_price:120, stock_quantity: 25, is_active: true },
        { key: "3", item_id: 3, item_type: "Appliances", name: "Microwave", description: "A compact microwave oven", price: 200, purchase_price:150, stock_quantity: 15, is_active: false },
    ];

      const openAdd = () => {
    setModalMode("add");
    setSelectedItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (item: CatalogItemType) => {
    setModalMode("edit");
    setSelectedItem(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };

  const openDelete = (item: CatalogItemType) => {
    setModalMode("delete");
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Item updated successfully  ");
    }else{
      message.success("Item added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Item deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedItem(null);
  };

    return (
        <>
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

        <CatalogItemModal
        open={isModalOpen}
        mode={modalMode}
        item={selectedItem}
        form={form}
        onCancel={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      </div>
        </>
    )
};

export default CatalogItem;