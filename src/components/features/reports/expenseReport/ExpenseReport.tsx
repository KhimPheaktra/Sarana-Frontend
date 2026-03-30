import { Card } from "antd";
import ExpenseReportTable from "./ExpenseReportTable";
import type { ExpensesType } from "../../expenses/expenses.types";
import type { PurchaseType } from "../../purchase/purchase.types";
import { useTranslation } from "react-i18next";

interface ExpenseReportProps {
    expenses: ExpensesType[];
    purchases: PurchaseType[];
}

const ExpenseReport = ({ expenses, purchases }: ExpenseReportProps) => {
    const {t} = useTranslation();
    return (
        <>
            <Card>
                <h1 style={{ padding: 0, margin: 0 }}>{t("title.expenseReport")}</h1>
                <ExpenseReportTable expenses={expenses} purchases={purchases} />
            </Card>
        </>
    );
};

export default ExpenseReport;