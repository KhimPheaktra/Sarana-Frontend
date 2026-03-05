import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { PurchaseType } from "./purchase.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PurchaseTable from "./PurchaseTable";
import PurchaseForm from "./PurchaseForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useSales } from "../sales/SaleContext";

const Purchase = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { purchases, setPurchase } = useSales(); 

  const titleMap = {
    add: "Add Purchase",
    edit: "Edit Purchase",
    delete: "Delete Purchase",
    view: "View Purchase",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      purchase_date: dayjs(),
      items: [{ item_id: undefined, qty: 1, unit_price: 0, subtotal: 0 }],
      status: "Pending",
    });

    openModal("add", {
      titleMap,
      content: <PurchaseForm form={form} mode="add" />,
      width: 900,
      onOk: async () => {
        try {
          const values = await form.validateFields();

          const newId =
            purchases.length > 0
              ? Math.max(...purchases.map((p) => p.purchase_id || 0)) + 1
              : 1;

          const newPurchase: PurchaseType = {
            key: String(newId),
            purchase_id: newId,
            supplier_id: values.supplier_id,
            purchase_date: values.purchase_date?.format("YYYY-MM-DD") ?? "",
            items: values.items.map((item: any, index: number) => ({
              item_id: item.item_id ?? index +1,
              item_name: item.item_name,
              qty: Number(item.qty),
              unit_price: Number(item.unit_price),
              subtotal: Number(item.subtotal),
            })),
            total_amount: Number(values.total_amount),
            note: values.note ?? "",
            status: values.status,
          };

          setPurchase((prev) => [...prev, newPurchase]);
          message.success("Purchase added successfully");
          closeModal();
        } catch (err) {
          console.error("Add failed:", err);
        }
      },
    });
  };

  const openEdit = (purchase: PurchaseType) => {
    form.setFieldsValue({
      ...purchase,
      purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : undefined,
      items: purchase.items.map((i) => ({ ...i })),
    });

    openModal("edit", {
      titleMap,
      content: <PurchaseForm form={form} mode="edit" />,
      width: 900,
      onOk: async () => {
        try {
          const values = await form.validateFields();

          setPurchase((prev) =>
            prev.map((p) =>
              p.purchase_id === purchase.purchase_id
                ? {
                    ...p,
                    supplier_id: values.supplier_id,
                    purchase_date: values.purchase_date?.format("YYYY-MM-DD") ?? "",
                    items: values.items.map((item: any) => ({
                      item_id: item.item_id,
                      item_name: item.item_name,
                      qty: Number(item.qty),
                      unit_price: Number(item.unit_price),
                      subtotal: Number(item.subtotal),
                    })),
                    total_amount: Number(values.total_amount),
                    note: values.note ?? "",
                    status: values.status,
                  }
                : p
            )
          );

          message.success("Purchase updated successfully");
          closeModal();
        } catch (err) {
          console.error("Edit failed:", err);
        }
      },
    });
  };

  const openView = (purchase: PurchaseType) => {
    form.setFieldsValue({
      ...purchase,
      purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : undefined,
      items: purchase.items.map((i) => ({ ...i })),
    });

    openModal("view", {
      titleMap,
      content: <PurchaseForm form={form} mode="view" />,
      width: 900,
      onOk: () => closeModal(),
      okTextMap: { view: "Close" },
    });
  };

  const openDelete = (purchase: PurchaseType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete purchase <b>#{purchase.purchase_id}</b>?
        </p>
      ),
      onOk: () => {
        setPurchase((prev) => prev.filter((p) => p.purchase_id !== purchase.purchase_id));
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
        buttonText="Add Purchase"
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