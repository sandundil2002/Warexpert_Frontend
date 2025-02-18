import {TableItem} from "../components/common/TableComponent.tsx";
import {SearchableItem} from "../components/common/SearchBarComponent.tsx";

export interface Transportation extends TableItem, SearchableItem {
    id: string;
    type: string;
    capacity: string;
    numberPlate: string;
    status: string;
    driverId: string;
}