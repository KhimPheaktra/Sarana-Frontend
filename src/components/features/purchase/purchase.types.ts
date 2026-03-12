export interface PurchaseItem {
  item_id: number | string;    
  item_name?: string;           
  qty: number;
  unit_price: number;
  subtotal?: number;        
}

export interface PurchaseType {
  key: string;
  purchase_id: number;
  supplier_id: number;
  supplier_name: string;
  purchase_date: string;  
  items: PurchaseItem[];       
  total_amount: number;         
  note?: string;
  status?: "Completed" | "Pending" | "Cancelled";
}