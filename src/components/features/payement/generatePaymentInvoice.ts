import { message } from "antd";
import React from "react";
import type { PaymentType } from "./payment.types";
import type { InvoiceType } from "../invoice/invoice.types";

export const generatePaymentInvoice = (
  payment: PaymentType,
  invoices: InvoiceType[],
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>
) => {
  if (payment.status !== "Completed") return;

  const exists = invoices.some(inv => inv.payment_id === payment.payment_id);
  if (exists) {
    message.warning("Invoice already generated for this payment");
    return;
  }

  const maxInvoiceId = invoices.length
    ? Math.max(...invoices.map(inv => inv.invoice_id))
    : 0;

  const newInvoice: InvoiceType = {
    key: `inv-${Date.now()}`,
    invoice_id: maxInvoiceId + 1,
    payment_id: payment.payment_id,
    customer_id: payment.customer_id ?? 0 + 1,
    customer_name: payment.customer_name,
    invoice_date: payment.payment_date,
    items: payment.payments.map(item => ({
      item_name: item.item_name,
      qty: item.qty,
      unit_price: item.unit_price,
      discount: item.discount ?? 0,
      amount: item.amount,
    })),
    total_amount: payment.total_amount,
    status: "Completed",
    reference_id: payment.reference_id,
    engineer: payment.engineer,
  };

  setInvoices(prev => [...prev, newInvoice]);
  // message.success("Success added to invoice");
};