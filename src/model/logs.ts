import {TableItem} from "../components/common/TableComponent.tsx";
import {SearchableItem} from "../components/common/SearchBarComponent.tsx";

export interface Logs extends TableItem, SearchableItem {
    id: string;
    type: string;
    incidents: string;
    staffId: string;
    warehouseId: string;
    inventoryId: string;
}