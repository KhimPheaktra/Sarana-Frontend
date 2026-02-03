
export interface PurchaseType {
  key: string;
  purchase_id: number;
  supplier_id: number;
  purchase_date: string;
  total_amount: number;
  item_id: number;
  quantity: number;
  unit_price: number;  
  subtotal?: number;
}

export type ModalMode = "add" | "edit" | "delete" | "view" | null;