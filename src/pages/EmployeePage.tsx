import React, { useEffect, useMemo, useState } from "react";
import { Employee } from "../model/employee.ts";
import { ColumnDef, TableComponent } from "../components/common/TableComponent.tsx";
import { TitleComponent } from "../components/common/TitleComponent.tsx";
import { SearchBarComponent } from "../components/common/SearchBarComponent.tsx";
import { PopupModalComponent } from "../components/popup/PopupModalComponent.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee, deleteEmployee, getEmployees, updateEmployee } from "../reducers/employee-slice.ts";
import { AppDispatch, RootState } from "../store/store.ts";
import { Warehouse } from "../model/warehouse.ts";
import {getWarehouses} from "../reducers/warehouse-slice.ts";
import {Navigate} from "react-router-dom";

interface Field {
    id: string;
    label: string;
    type: "text" | "email" | "select" | "time";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: { value: string; label: string }[];
}

export const EmployeePage: React.FC = () => {
    const employees = useSelector((state: RootState) => state.employee);
    const warehouses = useSelector((state: RootState) => state.warehouse);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (!employees.length) {
            dispatch(getEmployees());
        }
    }, [dispatch, employees.length]);

    useEffect(() => {
        if (!warehouses.length) {
            dispatch(getWarehouses());
        }
    }, [dispatch, warehouses.length]);

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    const fields: Field[] = [
        {
            id: 'employeeId',
            label: 'Employee ID',
            type: 'text',
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'employeeName',
            label: 'Employee Name',
            type: 'text',
            required: true,
        },
        {
            id: 'role',
            label: 'Role',
            type: 'select',
            required: true,
            options: [
                { value: 'MANAGER', label: 'Manager' },
                { value: 'SUPERVISOR', label: 'Supervisor' },
                { value: 'OPERATOR', label: 'Operator' },
                { value: 'OTHER', label: 'Other' },
            ],
        },
        {
            id: 'shiftSchedule',
            label: 'Shift Schedule',
            type: 'select',
            required: true,
            options: [
                { value: 'Midday Shift', label: 'Morning Shift' },
                { value: 'Afternoon Shift', label: 'Afternoon Shift' },
                { value: 'Night Shift', label: 'Night Shift' },
                { value: 'Standard Day Shift', label: 'Standard Day Shift' },
                { value: 'Midday Shift', label: 'Midday Shift' },
            ],
        },
        {
            id: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' },
            ],
        },
        {
            id: 'email',
            label: 'Email',
            type: 'email',
            required: true,
        },
        {
            id: 'mobile',
            label: 'Mobile',
            type: 'text',
            required: true,
        },
        {
            id: 'warehouseId',
            label: 'Warehouse Name',
            type: 'select',
            required: true,
            options: warehouses.map((warehouse: Warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
            })),
        },
    ];

    const columns: ColumnDef<Employee>[] = [
        { id: 'id', label: 'ID', align: "center" },
        { id: 'name', label: 'Name', align: "center" },
        { id: 'role', label: 'Role', align: "center" },
        { id: 'shiftSchedule', label: 'Shift Schedule', align: "center" },
        { id: 'gender', label: 'Gender', align: "center" },
        { id: 'email', label: 'Email', align: "center" },
        { id: 'mobile', label: 'Mobile', align: "center" },
        { id: 'warehouseId', label: 'Warehouse ID', align: "center" },
        { id: "createdAt", label: "Created", align: "center" },
        { id: 'actions', label: 'Actions', align: 'center' },
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedEmployee(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
    };

    const handleEdit = (employee: Employee) => {
        setMode('edit');
        setSelectedEmployee(employee);
        setOpen(true);
    };

    const handleDelete = async (employeeId: string) => {
        await dispatch(deleteEmployee(employeeId));
    };

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newEmployee: Employee = {
                id: `EMP00${employees.length + 1}`,
                name: data.employeeName,
                role: data.role,
                shiftSchedule: data.shiftSchedule,
                gender: data.gender,
                email: data.email,
                mobile: data.mobile,
                warehouseId: data.warehouseId,
            };
            await dispatch(addEmployee(newEmployee));
        } else {
            const updatedEmployee: Employee = {
                id: data.employeeId,
                name: data.employeeName,
                role: data.role,
                shiftSchedule: data.shiftSchedule,
                gender: data.gender,
                email: data.email,
                mobile: data.mobile,
                warehouseId: data.warehouseId,
            };
            await dispatch(updateEmployee({ id: updatedEmployee.id, employee: updatedEmployee }));
        }
        handleClose();
    };

    const displayEmployees = useMemo(() => {
        if (!searchQuery) {
            return employees;
        }
        return employees.filter((employee) =>
            employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [employees, searchQuery]);

    const handleEmployeeSelect = (employee: Employee | null) => {
        if (employee) {
            setSearchQuery(employee.id);
        } else {
            setSearchQuery('');
        }
    };

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Employee Section" addNew={handleOpen} />
                <SearchBarComponent<Employee>
                    title="Search Employee By ID"
                    data={employees}
                    onSelect={handleEmployeeSelect}
                />
                <TableComponent
                    data={displayEmployees}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableSelection={true}
                    onRowSelect={(employee) => console.log(employee)}
                    rowsPerPage={5}
                />
                <PopupModalComponent
                    open={open}
                    handleClose={handleClose}
                    title="Employee"
                    fields={fields}
                    onSubmit={handleSubmit}
                    initialData={mode === 'edit' ? {
                        employeeId: selectedEmployee?.id,
                        employeeName: selectedEmployee?.name,
                        email: selectedEmployee?.email,
                        mobile: selectedEmployee?.mobile,
                        role: selectedEmployee?.role,
                        shiftSchedule: selectedEmployee?.shiftSchedule,
                        gender: selectedEmployee?.gender,
                        warehouseId: selectedEmployee?.warehouseId,
                    } : undefined}
                    mode={mode}
                />
            </div>
        </>
    );
};