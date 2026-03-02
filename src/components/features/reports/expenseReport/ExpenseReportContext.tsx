import { useSales } from "../../sales/SaleContext";  
import ExpenseReport from "./ExpenseReport";

const ExpenseReportContext = () => {
  const { expenses, purchases } = useSales();

  return <ExpenseReport expenses={expenses} purchases={purchases} />;
};

export default ExpenseReportContext;