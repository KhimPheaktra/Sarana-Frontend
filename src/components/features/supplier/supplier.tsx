import { useState } from "react";
import type { ModalMode, SupplierType } from "./supplier.types";
import { Card, Form, message } from "antd";
import PageHeader from "../../layout/page_header/pageHeader";
import SupplierModal from "./supplierModal";
import {TeamOutlined} from "@ant-design/icons";
import SupplierTable from "./supplierTable";


const Supplier = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const suppliers: SupplierType[] = [
        { key: "1", supplier_id: 1, name: "Supplier A", phone_number: "0123456789", address: "Address A", email: "supplierA@example.com" },
        { key: "2", supplier_id: 2, name: "Supplier B", phone_number: "0987654321", address: "Address B", email: "supplierB@example.com" },
    ];

  const openAdd = () => {
    setModalMode("add");
    setSelectedSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (supplier: SupplierType) => {
    setModalMode("edit");
    setSelectedSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const openDelete = (supplier: SupplierType) => {
    setModalMode("delete");
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Supplier updated successfully  ");
    }else{
      message.success("Supplier added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Supplier deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedSupplier(null);
  };

    return (
        <>
        <div className="table-container">
        <PageHeader
                title="Supplier Management"
                count={suppliers.length}
                countLabel="suppliers"
                icon={<TeamOutlined />}
                onAdd={openAdd}
                buttonText="Add Supplier"
            />
        <Card>
            <SupplierTable
                data={suppliers}
                onEdit={openEdit}
                onDelete={openDelete}
            />
                
        </Card>

        <SupplierModal
        open={isModalOpen}
        mode={modalMode}
        supplier={selectedSupplier}
        form={form}
        onCancel={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      </div>
        </>
    )
};

export default Supplier;