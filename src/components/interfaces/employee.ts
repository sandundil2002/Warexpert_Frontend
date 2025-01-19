import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Employee extends TableItem, SearchableItem {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    address: string;
    image: string;
}