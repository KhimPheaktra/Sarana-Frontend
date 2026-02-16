import ExpenseReport from "./ExpenseReport";


const ExpenseReportContext = () => {

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
    
    return <ExpenseReport expenses={expenses} purchases={purchases} />;
};

export default ExpenseReportContext;