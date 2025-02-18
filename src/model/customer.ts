import {TableItem} from "../components/common/TableComponent.tsx";
import {SearchableItem} from "../components/common/SearchBarComponent.tsx";

export interface Customer extends TableItem, SearchableItem{
    id: string;
    name: string;
    address: string;
    mobile: string;
    email: string;
}