export interface UserType {
  key: string;
  id: number;
  name: string;
  status: string;
}

export type ModalMode = "add" | "edit" | "delete" | null;
