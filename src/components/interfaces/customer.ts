import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";

export interface Customer extends TableItem, SearchableItem{
    id: string;
    name: string;
    address: string;
    mobile: string;
    email: string;
}