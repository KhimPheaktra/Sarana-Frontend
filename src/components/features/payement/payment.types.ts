export interface PaymentItem {
    item_name: string;
    qty: number;
    unit_price: number;
    discount: number;
    amount: number;
}

export interface PaymentType {
    key: string;
    payment_id: number;
    customer_id: number; 
    customer_name: string; 
    payment_type: string;
    reference_id?: number;
    engineer: string;
    payments: PaymentItem[];
    total_amount: number;
    payment_date: string;
    status: string;
    partial_percentage?: number;
    note?: string;
}
