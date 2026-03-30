import type { InvoiceType } from "../invoice/invoice.types";
import type { PurchaseType } from "../purchase/purchase.types";
import type { PaymentType } from "./payment.types";

//   Creates a PaymentType entry from a newly added Invoice.
//   Reference ID format to: INV0001, INV0002, ...

export function paymentFromInvoice(
  invoice: InvoiceType,
  existingPayments: PaymentType[]
): PaymentType {
  const newId =
    existingPayments.length > 0
      ? Math.max(...existingPayments.map((p) => p.payment_id)) + 1
      : 1;

  const padded = String(invoice.invoice_id).padStart(4, "0");

  return {
    key: `pay-inv-${invoice.invoice_id}`,
    payment_id: newId,
    customer_id: invoice.customer_id,
    customer_name: invoice.customer_name,
    supplier_name: undefined,
    payment_type: "Cash",
    reference_id: `INV${padded}`,
    payments: invoice.items.map((i) => ({
      item_name: i.item_name,
      qty: i.qty,
      unit_price: i.unit_price,
      discount: i.discount ?? 0,
      amount: i.amount,
    })),
    engineer: invoice.engineer,
    total_amount: invoice.total_amount,
    payment_date: invoice.invoice_date,
    status: "Pending",
    note: "",
  };
}


//   Creates a PaymentType entry from a newly added Purchase.
//   Reference ID format to: P0001, P0002, ...
 export function paymentFromPurchase(
  purchase: PurchaseType,
  existingPayments: PaymentType[],
  paymentDetailImage?: string 
): PaymentType {
  const newId =
    existingPayments.length > 0
      ? Math.max(...existingPayments.map((p) => p.payment_id)) + 1
      : 1;

  const padded = String(purchase.purchase_id).padStart(4, "0");

  const payment: PaymentType = {
    key: `pay-pur-${purchase.purchase_id}`,
    payment_id: newId,
    customer_id: 0,
    customer_name: undefined,
    supplier_name: purchase.supplier_name,
    payment_type: "Cash",
    reference_id: `P${padded}`,
    payments: purchase.items.map((i) => ({
      item_name: i.item_name ?? "",
      qty: i.qty,
      unit_price: i.unit_price,
      discount: 0,
      amount: i.subtotal ?? i.qty * i.unit_price,
    })),
    engineer: undefined,
    total_amount: purchase.total_amount,
    payment_date: purchase.purchase_date,
    status: "Pending",
    note: purchase.note ?? "",
    payment_details: [], 
    paid_amount: 0,
  };

  // ✅ attach image if it exists
  if (paymentDetailImage) {
    payment.payment_details = [
      {
        id: Date.now(),
        ref_id: payment.payment_id,
        ref_type: "purchase",
        paid_amount: purchase.total_amount,
        payment_date: purchase.purchase_date,
        image: paymentDetailImage,
      },
    ];
    payment.paid_amount = purchase.total_amount;
    payment.status = "Paid";
  }

  return payment;
}