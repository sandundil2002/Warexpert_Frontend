import {TableItem} from "../common/TableComponent.tsx";

export interface Employee extends TableItem {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    address: string;
    image: string;
}