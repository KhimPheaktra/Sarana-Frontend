import { message } from "antd";
import type { QuoteType } from "../quote/quote.types";
import type { InvoiceType } from "./invoice.types";

export const generateQuoteInvoice = (
    quote: QuoteType,
    invoices: InvoiceType[],
    setInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>
) => {

    const exists = invoices.some(
        inv => inv.quote_id === quote.quote_id
    );

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
        item_name: quote.item,
        qty: quote.qty,
        unit_price: quote.unit_price || 0,
        total_amount: quote.total_amount,
        status: 'Completed',
        customer_id: countCustomer + 1
    };

    setInvoices(prev => [...prev, newInvoice]);

    message.success("Invoice generated");
};
