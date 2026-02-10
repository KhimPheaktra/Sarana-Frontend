

export interface CatalogItemType {
    key: string;
    item_id: number;
    item_type: string;
    name: string;
    description?: string;
    price: number;
    purchase_price: number;
    stock_quantity: number;
    is_active: boolean;

}