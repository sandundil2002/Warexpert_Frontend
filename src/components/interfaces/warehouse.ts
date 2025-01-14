import {TableItem} from "../common/TableComponent.tsx";

export interface Warehouse extends TableItem {
    id: string;
    name: string;
    location: string;
    size: string;
    capacity: string;
    staffMembers: string;
    inventories: string;
    image: string;
}