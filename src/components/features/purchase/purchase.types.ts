
export interface PurchaseType {
  key: string;
  purchase_id: number;
  supplier_id: number;
  purchase_date: string;
  total_amount: number;
  item_id: number;
  qty: number;
  unit_price: number;  
  subtotal?: number;
}
