import React, { useEffect, useMemo, useState } from "react";
import { Inventory } from "../model/inventory.ts";
import { ColumnDef, TableComponent } from "../components/common/TableComponent.tsx";
import { TitleComponent } from "../components/common/TitleComponent.tsx";
import { SearchBarComponent } from "../components/common/SearchBarComponent.tsx";
import { PopupModalComponent } from "../components/popup/PopupModalComponent.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addInventory, deleteInventory, getInventory, updateInventory } from "../reducers/inventory-slice.ts";
import { AppDispatch, RootState } from "../store/store.ts";
import { Warehouse } from "../model/warehouse.ts";
import { Customer } from "../model/customer.ts";
import { getWarehouses } from "../reducers/warehouse-slice.ts";
import { getCustomers } from "../reducers/customer-slice.ts";
import {Navigate} from "react-router-dom";

interface Field {
    id: string;
    label: string;
    type: "text" | "email" | "select" | "number" | "file" | "date";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: { value: string; label: string }[];
}

export const InventoryPage: React.FC = () => {
    const inventory = useSelector((state: RootState) => state.inventory);
    const warehouses = useSelector((state: RootState) => state.warehouse);
    const customers = useSelector((state: RootState) => state.customer);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (!inventory.length) {
            dispatch(getInventory());
        }
    }, [dispatch, inventory.length]);

    useEffect(() => {
        if (!warehouses.length) {
            dispatch(getWarehouses());
        }
    }, [dispatch, warehouses.length]);

    useEffect(() => {
        if (!customers.length) {
            dispatch(getCustomers());
        }
    }, [dispatch, customers.length]);

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    const fields: Field[] = [
        {
            id: 'inventoryId',
            label: 'Inventory ID',
            type: 'text',
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'inventoryName',
            label: 'Inventory Name',
            type: 'text',
            required: true,
        },
        {
            id: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            options: [
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Clothing', label: 'Clothing' },
                { value: 'Food', label: 'Food' },
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Other', label: 'Other' },
            ],
        },
        {
            id: 'quantity',
            label: 'Quantity',
            type: 'number',
            required: true,
        },
        {
            id: 'expiry',
            label: 'Expire Date',
            type: 'date',
            required: true,
        },
        {
            id: 'image',
            label: 'Inventory Image',
            type: 'file',
            required: true,
        },
        {
            id: 'warehouseId',
            label: 'Warehouse',
            type: 'select',
            required: true,
            options: warehouses.map((warehouse: Warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
            })),
        },
        {
            id: 'customerId',
            label: 'Customer',
            type: 'select',
            required: true,
            options: customers.map((customer: Customer) => ({
                value: customer.id,
                label: customer.name,
            })),
        },
    ];

    const columns: ColumnDef<Inventory>[] = [
        { id: 'id', label: 'ID', align: "center" },
        { id: 'name', label: 'Name', align: "center" },
        { id: 'category', label: 'Category', align: "center" },
        { id: 'quantity', label: 'Quantity', align: "center" },
        { id: 'status', label: 'Status', align: "center" },
        { id: 'expiry', label: 'Expiry', align: "center" },
        {
            id: 'image',
            label: 'Image',
            align: "center",
            render: (inventory: Inventory) => {
                const base64Image = inventory.image;
                return <img src={base64Image} alt="Inventory" className="w-16 h-16 rounded object-cover" />;
            },
        },
        { id: 'warehouseId', label: 'Warehouse ID', align: "center" },
        { id: 'customerId', label: 'Customer ID', align: "center" },
        { id: 'createdAt', label: 'Created At', align: "center" },
        { id: 'actions', label: 'Actions', align: 'center' },
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedInventory(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedInventory(null);
    };

    const handleEdit = (inventory: Inventory) => {
        setMode('edit');
        setSelectedInventory(inventory);
        setOpen(true);
    };

    const handleDelete = async (inventoryId: string) => {
        await dispatch(deleteInventory(inventoryId));
    };

    const handleSubmit = async (data: Record<string, any>) => {
        let imageBase64 = '';
        if (data.image && data.image instanceof File) {
            const readFileAsBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            };
            try {
                imageBase64 = await readFileAsBase64(data.image);
                console.log("Converted Image Base64:", imageBase64);
            } catch (error) {
                console.error("Error reading file:", error);
                alert("Failed to process the image. Please try again.");
                return;
            }
        } else {
            imageBase64 = selectedInventory?.image || '';
        }

        if (mode === 'create') {
            const newInventory: Inventory = {
                id: `INV00${inventory.length + 1}`,
                name: data.inventoryName,
                category: data.category,
                quantity: data.quantity,
                status: data.status,
                image: imageBase64,
                expiry: data.expiry,
                warehouseId: data.warehouseId,
                customerId: data.customerId,
            };
            await dispatch(addInventory(newInventory));
        } else {
            const updatedInventory: Inventory = {
                id: data.inventoryId,
                name: data.inventoryName,
                category: data.category,
                quantity: data.quantity,
                status: data.status,
                image: imageBase64,
                expiry: data.expiry,
                warehouseId: data.warehouseId,
                customerId: data.customerId,
            };
            await dispatch(updateInventory({ id: updatedInventory.id, inventory: updatedInventory }));
        }
        handleClose();
    };


    const displayedInventory = useMemo(() => {
        if (!searchQuery) {
            return inventory;
        }
        return inventory.filter((inventory) =>
            inventory.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inventory.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [inventory, searchQuery]);

    const handleInventorySelect = (inventory: Inventory | null) => {
        if (inventory) {
            setSearchQuery(inventory.id);
        } else {
            setSearchQuery('');
        }
    };

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Inventory Section" addNew={handleOpen} />
                <SearchBarComponent<Inventory>
                    title="Search Inventory By Id"
                    data={inventory}
                    onSelect={handleInventorySelect}
                />
                <TableComponent
                    data={displayedInventory}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableSelection={true}
                    onRowSelect={(inventory) => console.log('Selected inventory:', inventory)}
                />
                <PopupModalComponent
                    open={open}
                    handleClose={handleClose}
                    title="Inventory"
                    fields={fields}
                    onSubmit={handleSubmit}
                    initialData={mode === 'edit' ? {
                        inventoryId: selectedInventory?.id,
                        inventoryName: selectedInventory?.name,
                        category: selectedInventory?.category,
                        quantity: selectedInventory?.quantity,
                        status: selectedInventory?.status,
                        image: selectedInventory?.image, // Pass the Base64 string here
                        warehouseId: selectedInventory?.warehouseId,
                        customerId: selectedInventory?.customerId,
                    } : undefined}
                    mode={mode}
                />
            </div>
        </>
    );
};