import {TableItem} from "../components/common/TableComponent.tsx";
import {SearchableItem} from "../components/common/SearchBarComponent.tsx";

export interface Inventory extends TableItem, SearchableItem {
    id: string;
    name: string;
    category: string;
    quantity: string;
    status: string;
    image: string;
    warehouseId: string;
    customerId: string;
    expiry: string;
}