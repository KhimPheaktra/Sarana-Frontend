import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { PurchaseType } from "./purchase.types";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PurchaseTable from "./PurchaseTable";
import PurchaseForm from "./PurchaseForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useSales } from "../sales/SaleContext";
import { paymentFromPurchase } from "../payement/Autogeneratepayment";
import { catalogItemsData } from "../catalogItem/CatalogItem";
import { useTranslation } from "react-i18next";

const supplierMap: Record<number, string> = {
  1: "Supplier 1",
  2: "Supplier 2",
  3: "Supplier 3",
};
export const purchasesData: PurchaseType[] = [
  {
    key: "PO-001",
    purchase_id: 1001,
    supplier_id: 201,
    supplier_name: "TechSupply Co.",
    purchase_date: "2025-01-05",
    items: [
      { item_id: "ITM-01", item_name: "Mechanical Keyboard", qty: 10, unit_price: 85.0, subtotal: 850.0 },
      { item_id: "ITM-02", item_name: "USB-C Hub", qty: 15, unit_price: 35.0, subtotal: 525.0 },
    ],
    total_amount: 1375.0,
    note: "Urgent order for new hires",
    status: "Completed",
  },
  {
    key: "PO-002",
    purchase_id: 1002,
    supplier_id: 202,
    supplier_name: "OfficeWorld Ltd.",
    purchase_date: "2025-01-12",
    items: [
      { item_id: "ITM-03", item_name: "A4 Paper Ream", qty: 100, unit_price: 5.5, subtotal: 550.0 },
      { item_id: "ITM-04", item_name: "Ballpoint Pens (Box)", qty: 20, unit_price: 12.0, subtotal: 240.0 },
      { item_id: "ITM-05", item_name: "Sticky Notes Pack", qty: 30, unit_price: 4.0, subtotal: 120.0 },
    ],
    total_amount: 910.0,
    status: "Completed",
  },
  {
    key: "PO-003",
    purchase_id: 1003,
    supplier_id: 203,
    supplier_name: "FurniturePro Inc.",
    purchase_date: "2025-01-20",
    items: [
      { item_id: "ITM-06", item_name: "Ergonomic Office Chair", qty: 5, unit_price: 320.0, subtotal: 1600.0 },
      { item_id: "ITM-07", item_name: "Standing Desk", qty: 2, unit_price: 750.0, subtotal: 1500.0 },
    ],
    total_amount: 3100.0,
    note: "For the new meeting room setup",
    status: "Pending",
  },
  {
    key: "PO-004",
    purchase_id: 1004,
    supplier_id: 204,
    supplier_name: "NetworkEdge Solutions",
    purchase_date: "2025-02-03",
    items: [
      { item_id: "ITM-08", item_name: "Cat6 Ethernet Cable (50m)", qty: 10, unit_price: 22.0, subtotal: 220.0 },
      { item_id: "ITM-09", item_name: "Network Switch 24-port", qty: 2, unit_price: 180.0, subtotal: 360.0 },
    ],
    total_amount: 580.0,
    status: "Completed",
  },
  {
    key: "PO-005",
    purchase_id: 1005,
    supplier_id: 205,
    supplier_name: "CleanCare Supplies",
    purchase_date: "2025-02-14",
    items: [
      { item_id: "ITM-10", item_name: "Hand Sanitizer (1L)", qty: 50, unit_price: 8.0, subtotal: 400.0 },
      { item_id: "ITM-11", item_name: "Disinfectant Wipes (Pack)", qty: 40, unit_price: 6.5, subtotal: 260.0 },
      { item_id: "ITM-12", item_name: "Trash Bags (Roll)", qty: 25, unit_price: 3.0, subtotal: 75.0 },
    ],
    total_amount: 735.0,
    status: "Completed",
  },
  {
    key: "PO-006",
    purchase_id: 1006,
    supplier_id: 206,
    supplier_name: "PrintMaster Corp.",
    purchase_date: "2025-02-22",
    items: [
      { item_id: "ITM-13", item_name: "Laser Printer Toner (Black)", qty: 8, unit_price: 65.0, subtotal: 520.0 },
      { item_id: "ITM-14", item_name: "Laser Printer Toner (Color)", qty: 4, unit_price: 90.0, subtotal: 360.0 },
    ],
    total_amount: 880.0,
    note: "Quarterly toner restock",
    status: "Cancelled",
  },
  {
    key: "PO-007",
    purchase_id: 1007,
    supplier_id: 207,
    supplier_name: "ElectroHub Traders",
    purchase_date: "2025-03-05",
    items: [
      { item_id: "ITM-15", item_name: '27" Monitor', qty: 6, unit_price: 420.0, subtotal: 2520.0 },
      { item_id: "ITM-16", item_name: "Wireless Mouse", qty: 12, unit_price: 28.0, subtotal: 336.0 },
      { item_id: "ITM-17", item_name: "Monitor Stand", qty: 6, unit_price: 45.0, subtotal: 270.0 },
    ],
    total_amount: 3126.0,
    status: "Pending",
  },
  {
    key: "PO-008",
    purchase_id: 1008,
    supplier_id: 208,
    supplier_name: "SafeGuard Systems",
    purchase_date: "2025-03-11",
    items: [
      { item_id: "ITM-18", item_name: "Fire Extinguisher", qty: 4, unit_price: 95.0, subtotal: 380.0 },
      { item_id: "ITM-19", item_name: "First Aid Kit", qty: 6, unit_price: 40.0, subtotal: 240.0 },
    ],
    total_amount: 620.0,
    note: "Annual safety compliance restock",
    status: "Completed",
  },
  {
    key: "PO-009",
    purchase_id: 1009,
    supplier_id: 209,
    supplier_name: "BrewPoint Pantry",
    purchase_date: "2025-03-18",
    items: [
      { item_id: "ITM-20", item_name: "Ground Coffee (1kg)", qty: 20, unit_price: 18.0, subtotal: 360.0 },
      { item_id: "ITM-21", item_name: "Green Tea Bags (Box)", qty: 15, unit_price: 9.0, subtotal: 135.0 },
      { item_id: "ITM-22", item_name: "Sugar Sachets (Box)", qty: 10, unit_price: 7.5, subtotal: 75.0 },
      { item_id: "ITM-23", item_name: "Disposable Cups (Pack)", qty: 30, unit_price: 5.0, subtotal: 150.0 },
    ],
    total_amount: 720.0,
    status: "Completed",
  },
  {
    key: "PO-010",
    purchase_id: 1010,
    supplier_id: 210,
    supplier_name: "CloudGear Technologies",
    purchase_date: "2025-03-25",
    items: [
      { item_id: "ITM-24", item_name: "External SSD 1TB", qty: 7, unit_price: 110.0, subtotal: 770.0 },
      { item_id: "ITM-25", item_name: "Webcam HD 1080p", qty: 10, unit_price: 75.0, subtotal: 750.0 },
      { item_id: "ITM-26", item_name: "Noise-Cancelling Headset", qty: 5, unit_price: 130.0, subtotal: 650.0 },
    ],
    total_amount: 2170.0,
    note: "Remote work equipment for Q2 onboarding",
    status: "Pending",
  },
];

const Purchase = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { purchases, setPurchase, payments, setPayments } = useSales();
  const { t } = useTranslation();

  const titleMap = {
    add: t("modal.addTitle", { name: t("title.purchase") }),
    edit: t("modal.editTitle", { name: t("title.purchase") }),
    delete: t("modal.deleteTitle", { name: t("title.purchase") }),
    view: t("title.purchase"),
  };
  const okTextMap = {
    add: t("modal.okText"),
    edit: t("modal.okText"),
    delete: t("modal.deleteOkText"),
  };

 const openAdd = () => {
  form.resetFields();
  form.setFieldsValue({
    purchase_date: dayjs(),
    items: [{ item_name: undefined, qty: 1, unit_price: 0, subtotal: 0 }],
    status: "Pending",
  });

  openModal("add", {
    titleMap,
    okTextMap,
    content: <PurchaseForm form={form} mode="add" />,
    cancelText: t("modal.cancelText", { ns: "common" }),
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
          supplier_name: supplierMap[values.supplier_id] ?? "Unknown",
          purchase_date: values.purchase_date?.format("YYYY-MM-DD") ?? "",
          items: values.items.map((item: any, index: number) => {
            const catalogEntry = catalogItemsData.find((c) => c.item_id === item.item_name);
            return {
              item_id: item.item_name ?? index + 1,
              item_name: catalogEntry?.name ?? String(item.item_name ?? ""),
              qty: Number(item.qty),
              unit_price: Number(item.unit_price),
              subtotal: Number(item.subtotal),
            };
          }),
          total_amount: Number(values.total_amount),
          note: values.note ?? "",
          status: values.status,
        };
        setPurchase((prev) => [...prev, newPurchase]);
        const fileList = values.payment_detail;
        const imageUrl = fileList?.[0] ? URL.createObjectURL(fileList[0].originFileObj) : undefined;
        const referenceId = `P${String(newPurchase.purchase_id).padStart(4, "0")}`;
        const existingPayment = payments.find((p) => p.reference_id === referenceId);

        if (existingPayment) {
          const updatedPayment = { ...existingPayment };
          if (imageUrl) {
            updatedPayment.payment_details = [
              ...(existingPayment.payment_details || []),
              {
                id: Date.now(),
                ref_id: newPurchase.purchase_id,
                ref_type: "purchase",
                paid_amount: newPurchase.total_amount,
                payment_date: newPurchase.purchase_date,
                image: imageUrl,
              },
            ];
            updatedPayment.paid_amount = newPurchase.total_amount;
            updatedPayment.status = "Paid";
          }
          setPayments((prev) =>
            prev.map((p) => (p.payment_id === existingPayment.payment_id ? updatedPayment : p))
          );
        } else {
          const autoPayment = paymentFromPurchase(newPurchase, payments, imageUrl);
          setPayments((prev) => [...prev, autoPayment]);
        }

        message.success(
          `Purchase P${String(newId).padStart(4, "0")} added — payment record created`
        );
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
      items: purchase.items.map((i) => ({
        ...i,
        item_name: i.item_id,
      })),
    });

    openModal("edit", {
      titleMap,
      okTextMap,
      content: <PurchaseForm form={form} mode="edit" />,
      cancelText: t("modal.cancelText", { ns: "common" }),
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
                  supplier_name: supplierMap[values.supplier_id] ?? "Unknown",
                  purchase_date: values.purchase_date?.format("YYYY-MM-DD") ?? "",
                  items: values.items.map((item: any) => {
                    const catalogEntry = catalogItemsData.find((c) => c.item_id === item.item_name);
                    return {
                      item_id: item.item_name,
                      item_name: catalogEntry?.name ?? String(item.item_name ?? ""),
                      qty: Number(item.qty),
                      unit_price: Number(item.unit_price),
                      subtotal: Number(item.subtotal),
                    };
                  }),
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
      items: purchase.items.map((i) => ({
        ...i,
        item_name: i.item_id,
      })),
    });

    openModal("view", {
      titleMap,
      content: <PurchaseForm form={form} mode="view" />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      width: 900,
      onOk: () => closeModal(),
      okTextMap: {
        view: t("modal.cancelText", { ns: "common" }),
      },
    });
  };

  const openDelete = (purchase: PurchaseType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
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
      <ActionHeader
        title={t("title.purchase")}
        count={purchases.length}
        countLabel={t("title.purchase", { ns: "common" })}
        onAdd={openAdd}
        buttonText={t("button.add")}
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