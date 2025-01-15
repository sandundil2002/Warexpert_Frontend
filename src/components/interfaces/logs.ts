import {TableItem} from "../common/TableComponent.tsx";

export interface Logs extends TableItem {
    id: string;
    warehouse: string;
    inventory: string;
    action: string;
    timestamp: string;
    user: string;
}