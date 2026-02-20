export interface UserType {
  key: string;
  id: number;
  username: string;
  created_at?: Date;
  role: string;
  phone_number: string;
  status: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  city?: string;
  avatar?: string;
}

