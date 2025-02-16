import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Equipment extends TableItem, SearchableItem {
    id: string;
    type: string;
    category: string;
    status: string;
    staffId: string;
    warehouseId: string;
}