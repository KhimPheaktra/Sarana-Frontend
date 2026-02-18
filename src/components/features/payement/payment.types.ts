
export interface PaymentType {
    key: string;
    payment_id: number;
    customer_name: string; 
    payment_type: string;
    reference_id: number;
    item_name: string;
    qty: number;
    unit_price: number;
    total_amount: number;
    payment_date: string;
    status: string;
    partial_percentage?: number;
    note?: string;
}
