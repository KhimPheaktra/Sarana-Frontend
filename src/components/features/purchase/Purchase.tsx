import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { PurchaseType } from "./purchase.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PurchaseTable from "./PurchaseTable";
import PurchaseForm from "./PurchaseForm"; 
import { useAppModal } from "../../../shared/modal/AppModalProvider";

const Purchase = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const purchases: PurchaseType[] = [
    { key: "1", purchase_id: 1, supplier_id: 1, purchase_date: "2026-01-01", total_amount: 500, item_id: 1, quantity: 5, unit_price: 50, subtotal: 250 },
    { key: "2", purchase_id: 2, supplier_id: 2, purchase_date: "2026-01-05", total_amount: 300, item_id: 3, quantity: 15, unit_price: 20, subtotal: 300 },
  ];

  const titleMap = {
    add: "Add Purchase",
    edit: "Edit Purchase",
    delete: "Delete Purchase",
    view: "View Purchase",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ purchase_date: dayjs() });

    openModal<"add" | "edit" | "delete">("add", {
      titleMap,
      content: <PurchaseForm form={form} mode="add" />,
      onOk: async () => {
        await form.validateFields();
        message.success("Purchase added successfully");
        closeModal();
      },
    });
  };

  const openView = (purchase: PurchaseType) => {
    form.setFieldsValue({
      ...purchase,
      purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : undefined,
    });

    openModal<"view">("view", {
      titleMap,
      content: <PurchaseForm form={form} mode="view" />,
      onOk: () => {
        closeModal();
      },
      okTextMap: { view: "Close" },
    });
  };

  const openEdit = (purchase: PurchaseType) => {
    form.setFieldsValue({
      ...purchase,
      purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : undefined,
    });

    openModal<"edit">("edit", {
      titleMap,
      content: <PurchaseForm form={form} mode="edit" />,
      onOk: async () => {
        await form.validateFields();
        message.success("Purchase updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (purchase: PurchaseType) => {
    openModal<"delete">("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete purchase <b>#{purchase.purchase_id}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Purchase deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="Purchase Management"
        count={purchases.length}
        countLabel="purchases"
        onAdd={openAdd}
        buttonText="Add purchase"
        icon={<ShoppingCartOutlined />}
      />

      <Card>
        <PurchaseTable
          data={purchases}
          onView={openView}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default Purchase;
