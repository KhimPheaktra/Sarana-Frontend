import { Card } from "antd";
import ExpenseReportTable from "./ExpenseReportTable";
import type { ExpensesType } from "../../expenses/expenses.types";
import type { PurchaseType } from "../../purchase/purchase.types";

interface ExpenseReportProps {
    expenses: ExpensesType[];
    purchases: PurchaseType[];
}

const ExpenseReport = ({ expenses, purchases }: ExpenseReportProps) => {
    return (
        <>
            <Card>
                <h1 style={{ padding: 0, margin: 0 }}>Expense Report</h1>
                <ExpenseReportTable expenses={expenses} purchases={purchases} />
            </Card>
        </>
    );
};

export default ExpenseReport;