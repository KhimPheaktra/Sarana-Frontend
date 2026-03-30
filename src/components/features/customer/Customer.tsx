import { Card, Form, message } from "antd";
import type { CusType } from "./cus.types";
import { UserOutlined } from "@ant-design/icons";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useTranslation } from "react-i18next";

const Customer = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const customers: CusType[] = [
    { key: "1", id: 1, name: "Tra", phone_number: "012312313", address: "Sangkat 1", email: "tra@example.com" },
    { key: "2", id: 2, name: "Long", phone_number: "012312314", address: "Sangkat 2", email: "long@example.com" },
    { key: "3", id: 3, name: "Som", phone_number: "012312315", address: "Sangkat 3", email: "som@example.com" },
  ];

  const titleMap = {
    add: t("modal.addTitle", { name: t("title.customer") }),
    edit: t("modal.editTitle", { name: t("title.customer") }),
    delete: t("modal.deleteTitle", { name: t("title.customer") }),
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
      content: <CustomerForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        message.success("Customer added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (customer: CusType) => {
    form.setFieldsValue(customer);
    openModal("edit", {
      titleMap,
      okTextMap,
      content: <CustomerForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        message.success("Customer updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (customer: CusType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: (
        <p>
          Are you sure you want to delete <b>{customer.name}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Customer deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <ActionHeader
        title={t("title.customer")}
        count={customers.length}
        countLabel={t("title.customer", { ns: "common" })}
        icon={<UserOutlined />}
        onAdd={openAdd}
        buttonText={t("button.add")}
      />

      <Card>
        <CustomerTable
          data={customers}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default Customer;
