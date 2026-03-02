import { message } from "antd";
import type { QuoteType } from "./quote.types";
import type { InvoiceType } from "../invoice/invoice.types";
import React from "react";
export const generateQuoteInvoice = (
  quote: QuoteType,
  invoices: InvoiceType[],
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>
) => {
  const exists = invoices.some(inv => inv.quote_id === quote.quote_id);
  if (exists) {
    message.warning("Invoice already generated");
    return;
  }

  const maxInvoiceId = invoices.length
    ? Math.max(...invoices.map(inv => inv.invoice_id))
    : 0;
  const countCustomer = invoices.length
    ? Math.max(...invoices.map(inv => inv.customer_id))
    : 100;

  const newInvoice: InvoiceType = {
    key: `inv-${Date.now()}`,
    invoice_id: maxInvoiceId + 1,
    quote_id: quote.quote_id,
    quote_to: quote.quote_to,
    invoice_date: quote.quote_date,
    items: quote.items.map(row => ({
      item_name: row.item,
      qty: row.qty,
      unit_price: row.unit_price,
      discount: 0,
      amount: row.amount,
    })),
    total_amount: quote.total_amount,
    status: "Completed",
    engineer: quote.engineer,
    customer_id: countCustomer + 1,
    payment_id: 0
  };

  setInvoices(prev => [...prev, newInvoice]);
  message.success("Invoice generated");
};
