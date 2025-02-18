import {TableItem} from "../components/common/TableComponent.tsx";
import {SearchableItem} from "../components/common/SearchBarComponent.tsx";

export interface Equipment extends TableItem, SearchableItem {
    id: string;
    type: string;
    category: string;
    status: string;
    staffId: string;
    warehouseId: string;
}