import { Card } from "antd";
import { useSales } from "../../sales/SaleContext";
import ProfitReportTable from "./ProfitReportTable";
import { useTranslation } from "react-i18next";

const ProfitReport = () => {
  const { 
    invoices, 
    commissions, 
    expenses,      
    purchases,
  } = useSales();
  const {t} = useTranslation(); //default from common 

  return (
    <Card>
      <h1 className="mb-4 text-2xl font-bold">{t("title.profitLostReport")}</h1>

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