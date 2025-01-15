import {TableItem} from "../common/TableComponent.tsx";

export interface Customer extends TableItem{
    id: string;
    name: string;
    address: string;
    mobile: string;
    email: string;
}