import { Card, Form, message } from "antd";
import type { SupplierType } from "./supplier.types";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import SupplierTable from "./SupplierTable";
import SupplierForm from "./SupplierForm";
import { TruckOutlined } from "@ant-design/icons";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useTranslation } from "react-i18next";

const Supplier = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { t } = useTranslation();
  const suppliers: SupplierType[] = [
    { key: "1", supplier_id: 1, name: "Supplier A", phone_number: "0123456789", address: "Address A", email: "supplierA@example.com" },
    { key: "2", supplier_id: 2, name: "Supplier B", phone_number: "0987654321", address: "Address B", email: "supplierB@example.com" },
  ];

  const titleMap = {
    add: t("modal.addTitle", { name: t("title.supplier") }),
    edit: t("modal.editTitle", { name: t("title.supplier") }),
    delete: t("modal.deleteTitle", { name: t("title.supplier") }),
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
      content: <SupplierForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        message.success("Supplier added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (supplier: SupplierType) => {
    form.setFieldsValue(supplier);
    openModal("edit", {
      titleMap,
      okTextMap,
      content: <SupplierForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        message.success("Supplier updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (supplier: SupplierType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
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
      <ActionHeader
        title={t("title.supplier")}
        count={suppliers.length}
        countLabel={t("title.supplier", { ns: "common" })}
        icon={<TruckOutlined />}
        onAdd={openAdd}
        buttonText={t("button.add")}
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
