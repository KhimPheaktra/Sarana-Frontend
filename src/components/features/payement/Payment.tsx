import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { PaymentDetail, PaymentType } from "./payment.types";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import { DollarOutlined } from "@ant-design/icons";
import PaymentTable from "./PaymentTable";
import PaymentForm from "./PaymentForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useSales } from "../sales/SaleContext";
import { useTranslation } from "react-i18next";


export const paymentData: PaymentType[] = [
  {
    payment_id: 1,
    customer_name: "Tra",
    payment_type: "Cash",
    reference_id: "INV0001",
    payments: [{
      item_name: 'Item 1',
      qty: 1,
      unit_price: 120,
      discount: 0,
      amount: 120,
    }],
    engineer: "Tra",
    total_amount: 120,
    payment_date: "2026-02-02",
    status: "Pending",
    key: "",
    customer_id: 0
  },
  {
    payment_id: 2,
    supplier_name: "Long",
    payment_type: "Cash",
    reference_id: "P0001",
    payments: [{
      item_name: 'Item 1',
      qty: 1,
      unit_price: 120,
      discount: 0,
      amount: 120,
    }],
    total_amount: 120,
    payment_date: "2026-02-02",
    status: "Pending",
    key: "",
    customer_id: 0
  },
  {
    payment_id: 3,
    supplier_name: "Som",
    payment_type: "Bakor",
    reference_id: "P0002",
    payments: [{
      item_name: 'Item 1',
      qty: 1,
      unit_price: 120,
      discount: 0,
      amount: 120,
    }],
    total_amount: 120,
    payment_date: "2026-02-02",
    status: "Pending",
    key: "",
    customer_id: 0
  },
]


const Payment = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { payments, setPayments } = useSales();
  const { t } = useTranslation();
  const titleMap = {
    add: t("modal.addTitle", { name: t("title.payment") }),
    edit: t("modal.editTitle", { name: t("title.payment") }),
    delete: t("modal.deleteTitle", { name: t("title.payment") }),
  };
  const okTextMap = {
    add: t("modal.okText"),
    edit: t("modal.okText"),
    delete: t("modal.deleteOkText"),
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ payment_date: dayjs() });

    openModal("add", {
      titleMap,
      okTextMap,
      content: <PaymentForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      width: 800,
      onOk: async () => {
        const values = await form.validateFields();

        const isCustomer = values.partyType === "customer";
        const newPayment: PaymentType = {
          key: `pay-${Date.now()}`,
          payment_id: payments.length + 1,
          customer_id: isCustomer ? values.customer_id ?? 0 : 0,
          customer_name: isCustomer ? values.party_name : undefined,
          supplier_name: !isCustomer ? values.party_name : undefined,
          payment_type: values.payment_type,
          reference_id: values.reference_id,
          payments: values.payments ?? [],
          engineer: values.engineer,
          total_amount: values.total_amount,
          payment_date: values.payment_date?.format("YYYY-MM-DD") ?? "",
          status: values.status,
          note: values.note,

        };

        setPayments(prev => [...prev, newPayment]);
        message.success("Payment added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (payment: PaymentType) => {
    const partyType: "customer" | "supplier" = payment.customer_name ? "customer" : "supplier";
    const party_name: string =
      payment.customer_name ?? payment.supplier_name ?? "";
    partyType === "customer" ? payment.customer_name || "" : payment.supplier_name || "";
    form.setFieldsValue({
      ...payment,
      partyType,
      party_name,
      payment_date: payment.payment_date ? dayjs(payment.payment_date) : undefined,
    });

    openModal("edit", {
      titleMap,
      okTextMap,
      content: <PaymentForm form={form} />,
      width: 800,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        const values = await form.validateFields();

        const updatedPayment: PaymentType = {
          ...payment,
          ...values,
          payment_date: values.payment_date?.format("YYYY-MM-DD") ?? "",
          customer_name: values.partyType === "customer" ? values.party_name : undefined,
          supplier_name: values.partyType === "supplier" ? values.party_name : undefined,
        };

        setPayments(prev =>
          prev.map(p => p.key === payment.key ? updatedPayment : p)
        );

        message.success("Payment updated successfully");
        closeModal();
      },
    });
  };
  const openDelete = (payment: PaymentType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: <p>Are you sure you want to delete payment <b>{payment.payment_id}</b>?</p>,
      onOk: () => {
        setPayments(prev => prev.filter(p => p.key !== payment.key));
        message.success("Payment deleted successfully");
        closeModal();
      },
    });
  };

  const addPaymentDetail = (paymentId: number, detail: PaymentDetail) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.payment_id !== paymentId) return p;

        const newPaidAmount = (p.paid_amount || 0) + detail.paid_amount;

        let newStatus = "Unpaid";
        if (newPaidAmount === 0) newStatus = "Unpaid";
        else if (newPaidAmount < p.total_amount) newStatus = "Partial";
        else newStatus = "Paid";

        return {
          ...p,
          paid_amount: newPaidAmount,
          status: newStatus,
          details: [...(p.payment_details || []), detail],
        };
      })
    );
  };

  return (
    <div className="table-container">
      <ActionHeader
        title={t("title.payment")}
        count={payments.length}
        countLabel={t("title.payment", { ns: "common" })}
        onAdd={openAdd}
        buttonText={t("button.add")}
        icon={<DollarOutlined />}
      />
      <Card>
        <PaymentTable
          data={payments}
          onEdit={openEdit}
          onDelete={openDelete}
          onAddPaymentDetail={addPaymentDetail}
        />
      </Card>
    </div>
  );
};

export default Payment;