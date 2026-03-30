import type { InvoiceType } from "../invoice/invoice.types";
import type { PaymentDetail } from "../payement/payment.types";

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
  status?: CommissionStatus; 
  payment_details?: PaymentDetail[];
  paid_amount?: number; 
}