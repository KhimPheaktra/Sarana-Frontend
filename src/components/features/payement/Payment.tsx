import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { PaymentType } from "./payment.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { DollarOutlined } from "@ant-design/icons";
import PaymentTable from "./PaymentTable";
import PaymentForm from "./PaymentForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";


const Payment = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const payments: PaymentType[] = [
    {
      key: "1",
      payment_id: 1,
      customer_name: "Tra",
      payment_type: "Cash",
      reference_id: 1,
      amount: 100,
      payment_date: "2026-01-01",
      status: "Completed",
      partial_percentage: 50,
      note: "First payment",
    },
    {
      key: "2",
      payment_id: 2,
      customer_name: "Long",
      payment_type: "Bakor",
      reference_id: 2,
      amount: 200,
      payment_date: "2026-01-05",
      status: "Pendding",
    },
  ];

  const titleMap = {
    add: "Add Payment",
    edit: "Edit Payment",
    delete: "Delete Payment",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      payment_date: dayjs(),
    });

    openModal("add", {
      titleMap,
      content: <PaymentForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Payment added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (payment: PaymentType) => {
    form.setFieldsValue({
      ...payment,
      payment_date: payment.payment_date
        ? dayjs(payment.payment_date)
        : undefined,
    });

    openModal("edit", {
      titleMap,
      content: <PaymentForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Payment updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (payment: PaymentType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete payment{" "}
          <b>#{payment.payment_id}</b>?
        </p>
      ),
      onOk: () => {
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
