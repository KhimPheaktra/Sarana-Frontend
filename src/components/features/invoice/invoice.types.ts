
export interface InvoiceType {
    key: string;
    invoice_id: number;
    customer_id: number;
    quote_to: string;
    invoice_date: string;
    item_id: number;
    unit_price: number;
    discount?: number;
    quantity: number;
    total_amount: number;
    status: string;
}



