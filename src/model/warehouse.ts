import {TableItem} from "../components/common/TableComponent.tsx";
import {SearchableItem} from "../components/common/SearchBarComponent.tsx";

export interface Warehouse extends TableItem, SearchableItem {
    id: string;
    name: string;
    location: string;
    size: string;
    capacity: string;
    image: string;
}