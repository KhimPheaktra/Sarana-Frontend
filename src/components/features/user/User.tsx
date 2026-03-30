import { Card, Form, message } from "antd";
import type { UserType } from "./user.types";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { UserOutlined } from "@ant-design/icons";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useTranslation } from "react-i18next";

const User = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { t } = useTranslation();
  const users: UserType[] = [
    { key: "1", id: 1, username: "Tra", role: "Admin", phone_number: "012312112", status: "active" },
    { key: "2", id: 2, username: "Long", role: "Engineer", phone_number: "02141142", status: "inactive" },
  ];

  const titleMap = {
    add: t("modal.addTitle", { name: t("title.user") }),
    edit: t("modal.editTitle", { name: t("title.user") }),
    delete: t("modal.deleteTitle", { name: t("title.user") }),
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
      content: <UserForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
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
      okTextMap,
      content: <UserForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
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
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: (
        <p>
          Are you sure you want to delete user <b>{user.username}</b>?
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
      <ActionHeader
        title={t("title.user")}
        count={users.length}
        countLabel={t("title.user", { ns: "common" })}
        icon={<UserOutlined />}
        onAdd={openAdd}
        buttonText={t("button.add")}
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
