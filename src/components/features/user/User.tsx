import { Card, Form, message } from "antd";
import type { UserType } from "./user.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { UserOutlined } from "@ant-design/icons";
import { useAppModal } from "../../../shared/modal/AppModalProvider";

const User = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const users: UserType[] = [
    { key: "1", id: 1, name: "Tra", status: "active" },
    { key: "2", id: 2, name: "Long", status: "inactive" },
  ];

  const titleMap = {
    add: "Add User",
    edit: "Edit User",
    delete: "Delete User",
  };

  const openAdd = () => {
    form.resetFields();
    openModal("add", {
      titleMap,
      content: <UserForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("User added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (user: UserType) => {
    form.setFieldsValue(user);
    openModal("edit", {
      titleMap,
      content: <UserForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("User updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (user: UserType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete user <b>{user.name}</b>?
        </p>
      ),
      onOk: () => {
        message.success("User deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="User Management"
        count={users.length}
        countLabel="users"
        icon={<UserOutlined />}
        onAdd={openAdd}
        buttonText="Add User"
      />

      <Card>
        <UserTable
          data={users}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default User;
