import {TableItem} from "../common/TableComponent.tsx";

export interface Inventory extends TableItem {
    id: string;
    name: string;
    category: string;
    quantity: string;
    price: string;
    warehouse: string;
    image: string;
}