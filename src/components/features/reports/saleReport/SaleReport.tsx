import { Card } from "antd";
import SaleReportTable from "./SaleReportTable";
import { useTranslation } from "react-i18next";


const SaleReport = () => {
  const {t} = useTranslation();

  return (
    <>
       <Card>
      <h1 style={{padding:0,margin:0}}>{t("title.saleReport")}</h1>
        <SaleReportTable />
      </Card>
    </>
  );
};

export default SaleReport;