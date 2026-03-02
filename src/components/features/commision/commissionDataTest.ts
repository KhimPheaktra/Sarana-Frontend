import type { CommissionType } from "./commission.types";

export const commissionsData: CommissionType[] = [
        {
            key: "1",
            commission_id: 1,
            amount: 50,
            commission_date: "2026-02-01",
            description: "Sales Commission",
            engineer: "Long",
        },
           {
            key: "2",
            commission_id: 2,
            amount: 100,
            invoice_id: 1,
            commission_date: "2026-02-01",
            invoice_total: 250,     
            commission_rate: 18,
            status: "Paid", 
            description: "Fire Service",
            engineer: "Tra",
            project: "Fire Service",
        },
    ];