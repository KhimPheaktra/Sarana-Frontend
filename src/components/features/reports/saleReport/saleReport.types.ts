import type { InvoiceType } from "../../invoice/invoice.types";


export interface SaleReportType {
    key: string;
    total_sales: number;
    total_customers: number;
    total_items_sold: number;
    total_revenue: number;
    total_invoices: number;
    invoices: InvoiceType[];

}