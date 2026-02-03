import { Card, Form, message } from "antd";
import type { ModalMode, PaymentType } from "./payment.types";
import { useState } from "react";
import dayjs from "dayjs";
import PageHeader from "../../layout/page_header/pageHeader";
import { DollarOutlined } from "@ant-design/icons";
import PaymentTable from "./paymentTable";
import PaymentModal from "./paymentModal";


const Payment = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);


   const payments: PaymentType[] = [
        { key: "1", payment_id:1,customer_name: "Tra" ,payment_type: "Cash", reference_id: 1, amount: 100, payment_date: "2026-01-01", status: "Completed", partial_percentage: 50, note: "First payment" },
        { key: "2", payment_id:2,customer_name: "Long" ,payment_type: "Bakor", reference_id: 2, amount: 200, payment_date: "2026-01-05", status: "Pendding" },
    ];
      const openAdd = () => {
    setModalMode("add");
    setSelectedPayment(null);
    form.resetFields();
    setIsModalOpen(true);
     form.setFieldsValue({
    payment_date: dayjs() 
  });
  };
   
  const openEdit = (payment: PaymentType) => {
    setModalMode("edit");
    setSelectedPayment(payment);
    form.setFieldsValue({
      ...payment,
      payment_date: payment.payment_date ? dayjs(payment.payment_date) : undefined
    });
    setIsModalOpen(true);
  };

  const openDelete = (payment: PaymentType) => {
    setModalMode("delete");
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Payment updated successfully  ");
    }else{
      message.success("Payment added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Payment deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedPayment(null);
  };

  return (
    <>
          <div className="table-container">
        <PageHeader
                title="Payment Management"
                count={payments.length}
                countLabel="payments"
                onAdd={openAdd}
                icon={<DollarOutlined />}
            />
        <Card>
            <PaymentTable
                data={payments}
                onEdit={openEdit}
                onDelete={openDelete}
            />
                
        </Card>
          <PaymentModal
            open={isModalOpen}
            mode={modalMode}
            payment={selectedPayment}
            form={form}
            onCancel={closeModal}
            onSave={handleSave}
            onDelete={handleDelete}
        />
      </div>
    </>
  )
};

export default Payment;