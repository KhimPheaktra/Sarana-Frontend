
export interface QuoteType{
    key: string;
    quote_id: number;
    quote_to: string;
    item: string;
    quote_date: string;
    qty:number;
    unit: string;
    discount?:number;
    wth?: number;
    total_amount: number;
    status: string;
    notes?: string;
}
