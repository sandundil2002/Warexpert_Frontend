import {TableItem} from "../common/TableComponent.tsx";

export interface Equipment extends TableItem {
    id: string;
    name: string;
    category: string;
    quantity: string;
    warehouse: string;
    image: string;
}