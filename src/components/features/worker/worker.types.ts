export interface WorkerType {
  key: string;
  id: number;
  name: string;
  phone_number: string;
  address: string;
}

export type ModalMode = "add" | "edit" | "delete" | null;