import React, {useEffect, useMemo, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Customer } from "../components/interfaces/customer";
import { TitleComponent } from "../components/common/TitleComponent";
import { SearchBarComponent } from "../components/common/SearchBarComponent";
import { ColumnDef, TableComponent } from "../components/common/TableComponent";
import { PopupModalComponent } from "../components/popup/PopupModalComponent";
import {addCustomer, deleteCustomer, getCustomers, updateCustomer} from "../slices/CustomerSlice";
import {AppDispatch, RootState} from "../store/store.ts";

interface Field {
    id: string;
    label: string;
    type: "text" | "email";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
}

export const CustomerPage: React.FC = () => {
    const customers = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if(!customers.length) {
            dispatch(getCustomers());
        }
    }, [dispatch, customers.length]);

    const fields: Field[] = [
        {
            id: "customerId",
            label: "Customer ID",
            type: "text",
            placeholder: "Auto-generated",
            readOnly: true,
        },
        {
            id: "customerName",
            label: "Customer Name",
            type: "text",
            required: true,
        },
        {
            id: "address",
            label: "Address",
            type: "text",
            required: true,
        },
        {
            id: "mobile",
            label: "Mobile",
            type: "text",
            required: true,
        },
        {
            id: "email",
            label: "Email",
            type: "email",
            required: true,
        },
    ];

    const columns: ColumnDef<Customer>[] = [
        { id: "id", label: "ID", align: "center" },
        { id: "name", label: "Name", align: "center" },
        { id: "address", label: "Address", align: "center" },
        { id: "mobile", label: "Mobile", align: "center" },
        { id: "email", label: "Email", align: "center" },
        { id: "createdAt", label: "Created", align: "center" },
        { id: "updatedAt", label: "Updated", align: "center" },
        { id: "actions", label: "Actions", align: "center" },
    ];

    const handleOpen = () => {
        setMode("create");
        setSelectedCustomer(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCustomer(null);
    };

    const handleEdit = (customer: Customer) => {
        setMode("edit");
        setSelectedCustomer(customer);
        setOpen(true);
    };

    const handleDelete = async (customerId: string) => {
        await dispatch(deleteCustomer(customerId));
    };

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === "create") {
            const newCustomer: Customer = {
                id: `C00${customers.length + 1}`,
                name: data.customerName,
                address: data.address,
                mobile: data.mobile,
                email: data.email,
            };
            await dispatch(addCustomer(newCustomer));
        } else if (selectedCustomer) {
            const updatedCustomer: Customer = {
                id: selectedCustomer.id,
                name: data.customerName,
                address: data.address,
                mobile: data.mobile,
                email: data.email,
            };
            await dispatch(updateCustomer({ id: selectedCustomer.id, customer: updatedCustomer}));
        }
        handleClose();
    };

    const displayCustomers = useMemo(() => {
        if (!searchQuery) return customers;

        return customers.filter(
            (customer) =>
                customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);

    const handleCustomerSelect = (customer: Customer | null) => {
        if (customer) {
            setSearchQuery(customer.id);
        } else {
            setSearchQuery("");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <TitleComponent title="Customer Section" addNew={handleOpen} />
            <SearchBarComponent<Customer>
                title="Search Customer by ID"
                data={customers}
                onSelect={handleCustomerSelect}
            />
            <TableComponent
                data={displayCustomers}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                enableSelection={true}
            />
            <PopupModalComponent
                open={open}
                handleClose={handleClose}
                title="Customer"
                fields={fields}
                onSubmit={handleSubmit}
                initialData={mode === "edit" ? {
                            customerId: selectedCustomer?.id,
                            customerName: selectedCustomer?.name,
                            address: selectedCustomer?.address,
                            mobile: selectedCustomer?.mobile,
                            email: selectedCustomer?.email,
                        } : undefined }
                mode={mode}
            />
        </div>
    );
};