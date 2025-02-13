import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Inventory extends TableItem, SearchableItem {
    id: string;
    name: string;
    category: string;
    quantity: string;
    status: string;
    image: string;
    warehouseId: string;
    customerId: string;
}