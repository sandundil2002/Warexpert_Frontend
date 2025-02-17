import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Logs extends TableItem, SearchableItem {
    id: string;
    type: string;
    incidents: string;
    staffId: string;
    warehouseId: string;
    inventoryId: string;
}