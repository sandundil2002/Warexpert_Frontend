import {TableItem} from "../common/TableComponent.tsx";

export interface Transportation extends TableItem {
    id: string;
    name: string;
    category: string;
    quantity: string;
    warehouse: string;
    image: string;
}