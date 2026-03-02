export interface QuoteItem {
  item: string;
  qty: number;
  unit: string;
  unit_price: number;
  amount: number;
}

export interface QuoteType {
  key: string;
  quote_id: number;
  quote_to: string;
  quote_date: string;
  items: QuoteItem[];
  discount?: number;
  wth?: number;
  total_amount: number;
  status: string;
  notes?: string;
  engineer?: string;
}