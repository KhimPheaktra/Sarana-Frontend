export interface PaymentItem {
    item_name: string;
    qty: number;
    unit_price: number;
    discount: number;
    amount: number;
}
export interface PaymentDetail {
  id: number;
  ref_id: number;       
  ref_type: "payment"| "purchase" | "commission";
  paid_amount: number;
  payment_date: string;
  image?: string;
  note?: string;
}
export interface PaymentType {
    key: string;
    payment_id: number;
    customer_id?: number; 
    customer_name?: string; 
    supplier_id?: number;
    supplier_name?: string;
    payment_type: string;
    reference_id?: string;
    engineer?: string;
    payments: PaymentItem[];
    total_amount: number;
    payment_date: string;
    status: string;
    partial_percentage?: number;
    note?: string;
    payment_details?: PaymentDetail[];
    paid_amount?: number; 
}
