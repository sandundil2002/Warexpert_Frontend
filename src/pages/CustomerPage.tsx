import {TitleComponent} from "../components/common/TitleComponent.tsx";
import React, {useMemo, useState} from "react";
import {Customer} from "../components/interfaces/customer.ts";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addCustomer, deleteCustomer, updateCustomer} from "../slices/CustomerSlice.tsx";

interface RootState {
    customer: Customer[];
}

export const CustomerPage: React.FC = () => {
    const customers = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fields = [
        {
            id: 'customerId',
            label: 'CustomerModel ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'customerName',
            label: 'CustomerModel Name',
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

    const columns: ColumnDef<Customer>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'address', label: 'Address', align: 'left' },
        { id: 'mobile', label: 'Mobile', align: 'right' },
        { id: 'email', label: 'Email', align: 'right' },
        { id: 'actions', label: 'Actions', align: 'center' }
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
        dispatch(deleteCustomer(customerId));
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
            dispatch(addCustomer(newCustomer));
        } else {
            const updatedCustomer: Customer = {
                id: data.customerId,
                name: data.customerName,
                address: data.address,
                mobile: data.mobile,
                email: data.email,
            };
            dispatch(updateCustomer(updatedCustomer));
        }
        handleClose();
    }

    const displayCustomers = useMemo(() => {
        if (!searchQuery) {
            return customers;
        }
        return customers.filter((customer) =>
            customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);

    const handleCustomerSelect = (customer: Customer | null) => {
        if (customer) {
            setSearchQuery(customer.id);
        } else {
            setSearchQuery('');
        }
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent  title="CustomerModel Section" addNew={handleOpen} />

                <SearchBarComponent<Customer>
                    title="Search CustomerModel by ID"
                    data={customers}
                    onSelect={handleCustomerSelect}
                />

                <TableComponent
                    data={displayCustomers}
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
                    title="CustomerModel"
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