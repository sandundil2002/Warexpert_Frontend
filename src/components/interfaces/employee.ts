import {TableItem} from "../common/TableComponent.tsx";
import {SearchableItem} from "../common/SearchBarComponent.tsx";
import {Gender, UserRole} from "./enums.ts";

export interface Employee extends TableItem, SearchableItem {
    id: string;
    name: string;
    role: UserRole;
    shiftSchedule: string;
    gender: Gender;
    email: string;
    mobile: string;
    warehouseId: string;
}