import { Card, Form, message } from "antd";
import type { SupplierType } from "./supplier.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import SupplierTable from "./SupplierTable";
import SupplierForm from "./SupplierForm";
import { TruckOutlined } from "@ant-design/icons";
import { useAppModal } from "../../../shared/modal/AppModalProvider";

const Supplier = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const suppliers: SupplierType[] = [
    { key: "1", supplier_id: 1, name: "Supplier A", phone_number: "0123456789", address: "Address A", email: "supplierA@example.com" },
    { key: "2", supplier_id: 2, name: "Supplier B", phone_number: "0987654321", address: "Address B", email: "supplierB@example.com" },
  ];

  const titleMap = {
    add: "Add Supplier",
    edit: "Edit Supplier",
    delete: "Delete Supplier",
  };

  // Open Add Supplier Modal
  const openAdd = () => {
    form.resetFields();
    openModal("add", {
      titleMap,
      content: <SupplierForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Supplier added successfully");
        closeModal();
      },
    });
  };

  // Open Edit Supplier Modal
  const openEdit = (supplier: SupplierType) => {
    form.setFieldsValue(supplier);
    openModal("edit", {
      titleMap,
      content: <SupplierForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Supplier updated successfully");
        closeModal();
      },
    });
  };

  // Open Delete Supplier Modal
  const openDelete = (supplier: SupplierType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete supplier <b>{supplier.name}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Supplier deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="Supplier Management"
        count={suppliers.length}
        countLabel="suppliers"
        icon={<TruckOutlined />}
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
    </div>
  );
};

export default Supplier;
