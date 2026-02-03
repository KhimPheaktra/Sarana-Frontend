import {Card, Form, message } from "antd";
import React, { useState } from "react";
import UserTable from "./userTable";
import UserModal from "./userModal";
import { UserOutlined } from "@ant-design/icons";
import type { ModalMode, UserType } from "./user.types";
import PageHeader from "../../layout/page_header/pageHeader";

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const users: UserType[] = [
    { key: "1", id: 1, name: "Tra", status: "active" },
    { key: "2", id: 2, name: "Long", status: "inactive" },
  ];

  const openAdd = () => {
    setModalMode("add");
    setSelectedUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (user: UserType) => {
    setModalMode("edit");
    setSelectedUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const openDelete = (user: UserType) => {
    setModalMode("delete");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("User updated successfully  ");
    }else{
      message.success("User added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("User deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="table-container">
       <PageHeader
                title="User Management"
                count={users.length}
                countLabel="users"
                icon={<UserOutlined />}
                onAdd={openAdd}
                buttonText="Add Customer"
            />
    
      <Card>
        <UserTable
          data={users}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>

      <UserModal
        open={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        form={form}
        onCancel={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      </div>
    </>
  )
};

export default User;
