export interface InvoiceItem {
  item_name: string;
  qty: number;
  unit_price: number;
  discount: number;
  amount: number;
}

export interface InvoiceType {
  key: string;
  invoice_id: number;
  quote_id?: number;
  quote_to?: string;
  payment_id: number;
  reference_id?: string;
  invoice_date: string;
  items: InvoiceItem[];      
  total_amount: number;
  status: string;
  engineer?: string;
  customer_id: number;
  customer_name?: string;
  payment_detail?: string;
}