import { Card, Form, message } from "antd";
import { useState } from "react";
import type { CusType, ModalMode } from "./cus.types";
import CustomerTable from "./customerTable";
import CustomerModal from "./customerModal";
import {UserOutlined } from "@ant-design/icons";   
import PageHeader from "../../layout/pageHeader/pageHeader";

const Customer = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CusType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const customers: CusType[] = [
        { key: "1", id: 1, name: "Tra", phone_number: "012312313", address: "Sangkat 1", email: "tra@example.com" },
        { key: "2", id: 2, name: "Long", phone_number: "012312314", address: "Sangkat 2", email: "long@example.com" },
        { key: "3", id: 3, name: "Som", phone_number: "012312315", address: "Sangkat 3", email: "som@example.com" }
    ];
    
    const openAdd = () => {
    setModalMode("add");
    setSelectedCustomer(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (customer: CusType) => {
    setModalMode("edit");
    setSelectedCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalOpen(true);
  };

  const openDelete = (customer: CusType) => {
    setModalMode("delete");
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Customer updated successfully  ");
    }else{
      message.success("Customer added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Customer deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedCustomer(null);
  };

    return (
        <>
        <div className="table-container">
        <PageHeader
                title="Customer Management"
                count={customers.length}
                countLabel="customers"
                icon={<UserOutlined />}
                onAdd={openAdd}
                buttonText="Add Customer"
            />
        <Card>
            <CustomerTable
                data={customers}
                onEdit={openEdit}
                onDelete={openDelete}
            />
                
        </Card>

        <CustomerModal
        open={isModalOpen}
        mode={modalMode}
        customer={selectedCustomer}
        form={form}
        onCancel={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      </div>
        </>
    )
};
export default Customer;