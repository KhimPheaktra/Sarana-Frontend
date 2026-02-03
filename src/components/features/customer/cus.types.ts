

export interface CusType {
  key: string;
  id: number;
  name: string;
  phone_number: string;
  address: string;
  email?: string;
}

export type ModalMode = "add" | "edit" | "delete" | null;