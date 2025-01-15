import {TitleComponent} from "../components/common/TitleComponent.tsx";
import React, {useState} from "react";
import {Customer} from "../components/interfaces/customer.ts";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";

const sampleData: Customer[] = [
    {
        id: "WH001",
        name: "Main Warehouse",
        address: "123 Storage St",
        mobile: "10000",
        email: "Electronics",
    },
    {
        id: "WH002",
        name: "South Branch",
        address: "456 Depot Ave",
        mobile: "8000",
        email: "Furniture",
    }
];

export const CustomerPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(sampleData);
    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const fields = [
        {
            id: 'customerId',
            label: 'Customer ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'customerName',
            label: 'Customer Name',
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
            id: 'mobile',
            label: 'Mobile',
            type: 'text' as const,
            required: true
        },
        {
            id: 'email',
            label: 'Email',
            type: 'email' as const,
            required: true
        }
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedCustomer(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCustomer(null);
    };

    const handleEdit = (customers: Customer) => {
        setMode('edit');
        setSelectedCustomer(customers);
        setOpen(true);
    };

    const handleDelete = async (customerId: string) => {
        // Your existing delete logic...
        const updatedWarehouses = customers.filter(w => w.id !== customerId);
        setCustomers(updatedWarehouses);
    };

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newCustomer: Customer = {
                id: `WH00${customers.length + 1}`,
                name: data.customerName,
                address: data.address,
                mobile: data.mobile,
                email: data.email,
            };
            setCustomers([...customers, newCustomer]);
        } else {
            const updatedCustomers = customers.map(customer => {
                if (customer.id === selectedCustomer?.id) {
                    return {
                        ...customer,
                        name: data.customerName,
                        address: data.address,
                        mobile: data.mobile,
                        email: data.email,
                    };
                }
                return customer;
            });
            setCustomers(updatedCustomers);
        }
        handleClose();
    }

    const columns: ColumnDef<Customer>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'address', label: 'Address', align: 'left' },
        { id: 'mobile', label: 'Mobile', align: 'right' },
        { id: 'email', label: 'Email', align: 'right' },
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent  title="Customer Section" addNew={handleOpen} />

                <SearchBarComponent title="Search Customer By ID" />

                <TableComponent
                    data={customers}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableSelection={true}
                    onRowSelect={(customers) => console.log('Selected customers:', customers)}
                    rowsPerPage={5}
                />

                <PopupModalComponent
                    open={open}
                    handleClose={handleClose}
                    title="Customer"
                    fields={fields}
                    onSubmit={handleSubmit}
                    initialData={mode === 'edit' ? {
                        customerId: selectedCustomer?.id,
                        customerName: selectedCustomer?.name,
                        address: selectedCustomer?.address,
                        mobile: selectedCustomer?.mobile,
                        email: selectedCustomer?.email
                    } : undefined }
                    mode={mode}
                />
            </div>
        </>
    );
};