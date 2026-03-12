import type { InvoiceType } from "../invoice/invoice.types";

export type CommissionStatus = "Pending" | "Paid" | "Cancelled";

export interface CommissionType {
  key: string;
  commission_id: number;
  amount: number;             
  commission_date: string;
  description?: string;
  engineer?: string;
  project?: string;      
  invoices?: InvoiceType[];   
  invoice_id?: number; 
  invoice_total?: number;      
  commission_rate?: number;
  payment_detail?: string;
  status?: CommissionStatus; 
}