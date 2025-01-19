import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Equipment extends TableItem, SearchableItem {
    id: string;
    name: string;
    category: string;
    quantity: string;
    warehouse: string;
    image: string;
}