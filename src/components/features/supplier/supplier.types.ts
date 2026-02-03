

export interface SupplierType {
    key: string;
    supplier_id: number;
    name: string;
    phone_number: string;
    address: string;
    email: string;
}

export type ModalMode = "add" | "edit" | "delete" | null;