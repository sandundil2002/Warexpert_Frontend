import React, {useState} from "react";
import {Employee} from "../components/interfaces/employee.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";

const sampleData: Employee[] = [
    {
        id: "EMP001",
        name: "John Doe",
        email: "abc@gmail.com",
        mobile: "1234567890",
        role: "Manager",
        address: "123 Storage St",
        image: "john.jpg"
    },
    {
        id: "EMP002",
        name: "Jane Doe",
        email: "xyz@gmail.com",
        mobile: "0987654321",
        role: "Staff",
        address: "456 Depot Ave",
        image: "jane.jpg"
    }
];

export const EmployeePage:React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>(sampleData);
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

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
        const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
        setEmployees(updatedEmployees);
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
            setEmployees([...employees, newEmployee]);
        } else {
            const updatedEmployees = employees.map(employee => {
                if (employee.id === selectedEmployee?.id) {
                    return {
                        ...employee,
                        name: data.employeeName,
                        email: data.email,
                        mobile: data.mobile,
                        role: data.role,
                        address: data.address,
                        image: data.image
                    };
                }
                return employee;
            });
            setEmployees(updatedEmployees);
        }
        setOpen(false);
        setSelectedEmployee(null);
    }

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

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Employee Section" addNew={handleOpen} />
                <SearchBarComponent title="Search Employee By ID" />
                <TableComponent
                    data={employees}
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