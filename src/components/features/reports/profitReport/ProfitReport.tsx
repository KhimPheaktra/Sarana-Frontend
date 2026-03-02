import { Card } from "antd";
import { useSales } from "../../sales/SaleContext";
import ProfitReportTable from "./ProfitReportTable";

const ProfitReport = () => {
  const { 
    invoices, 
    commissions, 
    expenses,      
    purchases,
  } = useSales();

  return (
    <Card>
      <h1 className="mb-4 text-2xl font-bold">Profit & Loss Statement</h1>

      <ProfitReportTable
        invoices={invoices}
        expenses={expenses}      
        purchases={purchases}   
        commissions={commissions}
      />
    </Card>
  );
};

export default ProfitReport;