import type { ExpensesType } from "../../expenses/expenses.types";
import type { PurchaseType } from "../../purchase/purchase.types";

export interface ExpenseReportType {
    key: string;
    total_expenses: number;
    total_purchases: number;
    total_commissions: number;
    ExpenseTypes: ExpensesType;
    purchaseTypes: PurchaseType;
}