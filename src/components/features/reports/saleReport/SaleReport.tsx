import { Card } from "antd";
import SaleReportTable from "./SaleReportTable";


const SaleReport = () => {

  return (
    <>
       <Card>
      <h1 style={{padding:0,margin:0}}>Sale Report</h1>
        <SaleReportTable />
      </Card>
    </>
  );
};

export default SaleReport;