import { Card, Form, message } from "antd";
import type { CusType } from "./cus.types";
import { UserOutlined } from "@ant-design/icons";
import PageHeader from "../../../shared/action-header/ActionHeader";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";

const Customer = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const customers: CusType[] = [
    { key: "1", id: 1, name: "Tra", phone_number: "012312313", address: "Sangkat 1", email: "tra@example.com" },
    { key: "2", id: 2, name: "Long", phone_number: "012312314", address: "Sangkat 2", email: "long@example.com" },
    { key: "3", id: 3, name: "Som", phone_number: "012312315", address: "Sangkat 3", email: "som@example.com" },
  ];

  const titleMap = {
    add: "Add Customer",
    edit: "Edit Customer",
    delete: "Delete Customer",
  };

  const openAdd = () => {
    form.resetFields();
    openModal("add", {
      titleMap,
      content: <CustomerForm form={form} />,
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
      content: <CustomerForm form={form} />,
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
    </div>
  );
};

export default Customer;
