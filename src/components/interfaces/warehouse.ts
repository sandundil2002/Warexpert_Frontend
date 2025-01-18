import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Warehouse extends TableItem, SearchableItem {
    id: string;
    name: string;
    location: string;
    size: string;
    capacity: string;
    staffMembers: string;
    inventories: string;
    image: string;
}