import { Card } from "antd";
import { useSales } from "../../sales/SaleContext";
import ProfitReportTable from "./ProfitReportTable";

const ProfitReport = () => {
    const { invoices } = useSales();
  const expenses = [
        {
            key: "1",
            expenses_id: 1,
            description: "Party",
            amount: 50,
            expenses_date: "2026-02-02",
            category: "Party",
        },
    ];

    const purchases = [
        { 
            key: "1", 
            purchase_id: 1, 
            supplier_id: 1, 
            purchase_date: "2026-02-01", 
            total_amount: 500, 
            item_id: 1, 
            qty: 5, 
            unit_price: 50, 
            subtotal: 250 
        },
        { 
            key: "2", 
            purchase_id: 2, 
            supplier_id: 2, 
            purchase_date: "2026-02-05", 
            total_amount: 300, 
            item_id: 3, 
            qty: 15, 
            unit_price: 20, 
            subtotal: 300 
        },
    ];

    const commissions = [
        {
            key: '1',
            commission_id: 1,
            amount: 50,
            commission_date: '2026-02-01',
            description: 'Sales Commission',
            engineer: 'Long',
        },
    ];
return (
    <Card>
        <h1 className="mb-4 text-2xl font-bold">Profit & Loss Statment</h1>
        <ProfitReportTable 
           invoices={invoices}
            expenses={expenses}
            purchases={purchases}
            commissions={commissions}
        />
    </Card>
    )
}

export default ProfitReport;