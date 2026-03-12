import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { PaymentType } from "./payment.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { DollarOutlined } from "@ant-design/icons";
import PaymentTable from "./PaymentTable";
import PaymentForm from "./PaymentForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { generatePaymentInvoice } from "./generatePaymentInvoice";
import { useSales } from "../sales/SaleContext";


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
  }
]

const Payment = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { invoices, setInvoices, payments, setPayments } = useSales();

  const titleMap = {
    add: "Add Payment",
    edit: "Edit Payment",
    delete: "Delete Payment",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ payment_date: dayjs() });

    openModal("add", {
      titleMap,
      content: <PaymentForm form={form} />,
      width: 800,
      onOk: async () => {
        const values = await form.validateFields();

        const newPayment: PaymentType = {
          key: `pay-${Date.now()}`,
          payment_id: payments.length + 1,
          customer_id: values.customer_id ?? 0,
          customer_name: values.customer_name,
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
        generatePaymentInvoice(newPayment, invoices, setInvoices);
        message.success("Payment added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (payment: PaymentType) => {
    form.setFieldsValue({
      ...payment,
      payment_date: payment.payment_date ? dayjs(payment.payment_date) : undefined,
    });

    openModal("edit", {
      titleMap,
      content: <PaymentForm form={form} />,
      onOk: async () => {
        const values = await form.validateFields();

        const updatedPayment: PaymentType = {
          ...payment,
          ...values,
          payment_date: values.payment_date?.format("YYYY-MM-DD") ?? "",
        };

        setPayments(prev =>
          prev.map(p => p.key === payment.key ? updatedPayment : p)
        );
        generatePaymentInvoice(updatedPayment, invoices, setInvoices);
        message.success("Payment updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (payment: PaymentType) => {
    openModal("delete", {
      titleMap,
      content: <p>Are you sure you want to delete payment <b>{payment.payment_id}</b>?</p>,
      onOk: () => {
        setPayments(prev => prev.filter(p => p.key !== payment.key));
        message.success("Payment deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="Payment Management"
        count={payments.length}
        countLabel="payments"
        onAdd={openAdd}
        buttonText="Add Payment"
        icon={<DollarOutlined />}
      />
      <Card>
        <PaymentTable
          data={payments}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default Payment;