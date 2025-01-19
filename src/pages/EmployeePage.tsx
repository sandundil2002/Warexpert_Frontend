import React, {useMemo, useState} from "react";
import {Employee} from "../components/interfaces/employee.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addEmployee, deleteEmployee, updateEmployee} from "../slices/SearchSlice.tsx";

interface RootState {
    employee: Employee[];
}
export const EmployeePage:React.FC = () => {
    const employees = useSelector((state: RootState) => state.employee);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fields = [
        {
            id: 'employeeId',
            label: 'Employee ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'employeeName',
            label: 'Employee Name',
            type: 'text' as const,
            required: true
        },
        {
            id: 'email',
            label: 'Email',
            type: 'email' as const,
            required: true
        },
        {
            id: 'mobile',
            label: 'Mobile',
            type: 'text' as const,
            required: true
        },
        {
            id: 'role',
            label: 'Role',
            type: 'text' as const,
            required: true
        },
        {
            id: 'address',
            label: 'Address',
            type: 'text' as const,
            required: true
        },
        {
            id: 'image',
            label: 'Image',
            type: 'text' as const,
            required: true
        }
    ];

    const columns: ColumnDef<Employee>[] = [
        {id: 'id', label: 'ID'},
        {id: 'name', label: 'Name'},
        {id: 'email', label: 'Email'},
        {id: 'mobile', label: 'Mobile'},
        {id: 'role', label: 'Role'},
        {id: 'address', label: 'Address'},
        {id: 'image', label: 'Image'},
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedEmployee(null);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
    }

    const handleEdit = (employeeId: Employee) => {
        setMode('edit');
        setSelectedEmployee(employeeId);
        setOpen(true);
    }

    const handleDelete = async (employeeId: string) => {
        dispatch(deleteEmployee(employeeId));
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newEmployee: Employee = {
                id: `EMP00${employees.length + 1}`,
                name: data.employeeName,
                email: data.email,
                mobile: data.mobile,
                role: data.role,
                address: data.address,
                image: data.image
            };
            dispatch(addEmployee(newEmployee));
        } else {
            const updatedEmployee: Employee = {
                id: data.employeeId,
                name: data.employeeName,
                email: data.email,
                mobile: data.mobile,
                role: data.role,
                address: data.address,
                image: data.image
            };
            dispatch(updateEmployee(updatedEmployee));
        }
        handleClose();
    }

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
    }

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
                        address: selectedEmployee?.address,
                        image: selectedEmployee?.image
                    } : undefined }
                    mode={mode}
                />
            </div>
        </>
    );
};