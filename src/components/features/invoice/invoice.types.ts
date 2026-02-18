
export interface InvoiceType {
    key: string;
    invoice_id: number;
    customer_id: number;
    quote_id?: number;
    quote_to?: string ;
    engineer?: string;
    invoice_date: string;
    item_name: string;
    unit_price: number;
    discount?: number;
    qty: number;
    total_amount: number;
    status: string;
}



