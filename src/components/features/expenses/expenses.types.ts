

export interface ExpensesType {
    key: string;
    expenses_id: number;
    description: string;
    amount: number;
    expenses_date: string;
    category: string;
}

export type ModalMode = "add" | "edit" | "delete" | null; 