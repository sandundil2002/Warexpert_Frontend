import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Transportation extends TableItem, SearchableItem {
    id: string;
    type: string;
    capacity: string;
    numberPlate: string;
    status: string;
    driverId: string;
}