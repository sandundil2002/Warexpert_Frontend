import {Inventory} from "../components/interfaces/inventory.ts";
import React, {useState} from "react";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";

const sampleDate: Inventory[] = [
    {
        id: "INV001",
        name: "Laptop",
        category: "Electronics",
        quantity: "100",
        price: "1000",
        warehouse: "Main Warehouse",
        image: "laptop.jpg"
    },
    {
        id: "INV002",
        name: "Chair",
        category: "Furniture",
        quantity: "200",
        price: "500",
        warehouse: "South Branch",
        image: "chair.jpg"
    }
];

export const InventoryPage: React.FC = () => {

    const [inventory, setInventory] = useState<Inventory[]>(sampleDate);
    const [open, setOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const fields = [
        {
            id: 'inventoryId',
            label: 'Inventory ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'inventoryName',
            label: 'Inventory Name',
            type: 'text' as const,
            required: true
        },
        {
            id: 'category',
            label: 'Category',
            type: 'text' as const,
            required: true
        },
        {
            id: 'quantity',
            label: 'Quantity',
            type: 'number' as const,
            required: true
        },
        {
            id: 'price',
            label: 'Price',
            type: 'number' as const,
            required: true
        },
        {
            id: 'warehouse',
            label: 'Warehouse',
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

    const columns: ColumnDef<Inventory>[] = [
        {id: 'id', label: 'ID'},
        {id: 'name', label: 'Name'},
        {id: 'category', label: 'Category'},
        {id: 'quantity', label: 'Quantity'},
        {id: 'price', label: 'Price'},
        {id: 'warehouse', label: 'Warehouse'},
        {id: 'image', label: 'Image'},
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedInventory(null);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedInventory(null);
    }

    const handleEdit = (inventory: Inventory) => {
        setMode('edit');
        setSelectedInventory(inventory);
        setOpen(true);
    }

    const handleDelete = async (inventoryId: string) => {
        setInventory(inventory.filter(inventory => inventory.id !== inventoryId));
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newInventory: Inventory = {
                id: `INV00${inventory.length + 1}`,
                name: data.inventoryName,
                category: data.category,
                quantity: data.quantity,
                price: data.price,
                warehouse: data.warehouse,
                image: data.image
            };
            setInventory([...inventory, newInventory]);
        } else {
            const updatedInventory = inventory.map(inventory => {
                if (inventory.id === selectedInventory?.id) {
                    return {
                        ...inventory,
                        name: data.inventoryName,
                        category: data.category,
                        quantity: data.quantity,
                        price: data.price,
                        warehouse: data.warehouse,
                        image: data.image
                    };
                }
                return inventory;
            });
            setInventory(updatedInventory);
        }
        handleClose();
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Inventory Section" addNew={handleOpen}/>
                <SearchBarComponent title="Search Inventory By Id" />
                <TableComponent
                    data={inventory}
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
                        price: selectedInventory?.price,
                        warehouse: selectedInventory?.warehouse,
                        image: selectedInventory?.image
                    } : undefined }
                    mode={mode}
                />
            </div>
        </>
    );
};