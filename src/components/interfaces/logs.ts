import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Logs extends TableItem, SearchableItem {
    id: string;
    warehouse: string;
    inventory: string;
    action: string;
    timestamp: string;
    user: string;
}