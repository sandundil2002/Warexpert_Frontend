import React, { useState } from "react";
import { PopupModalComponent } from "../components/popup/PopupModalComponent.tsx";
import { TitleComponent } from "../components/common/TitleComponent";
import { SearchBarComponent } from "../components/common/SearchBarComponent";
import { ColumnDef, TableComponent } from "../components/common/TableComponent";
import { Warehouse } from "../components/interfaces/warehouse";

// Sample data - replace with your actual data source
const sampleData: Warehouse[] = [
    {
        id: "WH001",
        name: "Main Warehouse",
        location: "123 Storage St",
        size: "10000",
        capacity: "5000",
        staffMembers: "10",
        inventories: "Electronics",
        image: "warehouse1.jpg"
    },
    {
        id: "WH002",
        name: "South Branch",
        location: "456 Depot Ave",
        size: "8000",
        capacity: "4000",
        staffMembers: "8",
        inventories: "Furniture",
        image: "warehouse2.jpg"
    }
];

export const WarehousesPage: React.FC = () => {
    // State
    const [warehouses, setWarehouses] = useState<Warehouse[]>(sampleData);
    const [open, setOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    // Form fields configuration
    const fields = [
        {
            id: 'warehouseId',
            label: 'Warehouse ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'warehouseName',
            label: 'Warehouse Name',
            type: 'text' as const,
            required: true
        },
        {
            id: 'location',
            label: 'Location',
            type: 'text' as const,
            required: true
        },
        {
            id: 'size',
            label: 'Size',
            type: 'number' as const,
            required: true
        },
        {
            id: 'capacity',
            label: 'Capacity',
            type: 'number' as const,
            required: true
        },
        {
            id: 'staffId',
            label: 'Staff ID',
            type: 'select' as const,
            required: true,
            options: [
                { value: '1', label: 'Staff 1' },
                { value: '2', label: 'Staff 2' }
            ]
        },
        {
            id: 'inventories',
            label: 'Inventories',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'electronics', label: 'Electronics' },
                { value: 'furniture', label: 'Furniture' }
            ]
        },
        {
            id: 'image',
            label: 'Warehouse Image',
            type: 'file' as const,
            required: true,
            accept: 'image/*'
        }
    ];

    // Table columns configuration
    const columns: ColumnDef<Warehouse>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'location', label: 'Location', align: 'left' },
        { id: 'size', label: 'Size', align: 'right' },
        { id: 'capacity', label: 'Capacity', align: 'right' },
        { id: 'staffMembers', label: 'Staff Members', align: 'right' },
        { id: 'inventories', label: 'Inventories', align: 'left' },
        {
            id: 'image',
            label: 'Image',
            align: 'left',
            render: (warehouse: Warehouse) => (
                <img
                    src={warehouse.image}
                    alt={`${warehouse.name} image`}
                    className="w-10 h-10 rounded object-cover"
                />
            )
        },
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedWarehouse(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWarehouse(null);
    };

    const handleEdit = (warehouse: Warehouse) => {
        setMode('edit');
        setSelectedWarehouse(warehouse);
        setOpen(true);
    };

    const handleDelete = async (warehouseId: string) => {
        // Your existing delete logic...
        const updatedWarehouses = warehouses.filter(w => w.id !== warehouseId);
        setWarehouses(updatedWarehouses);
    };

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            // Handle creation
            const newWarehouse: Warehouse = {
                id: `WH${(warehouses.length + 1).toString().padStart(3, '0')}`,
                name: data.warehouseName,
                location: data.location,
                size: data.size,
                capacity: data.capacity,
                staffMembers: data.staffId,
                inventories: data.inventories,
                image: data.image instanceof File ? URL.createObjectURL(data.image) : 'default-image.jpg'
            };
            setWarehouses([...warehouses, newWarehouse]);
        } else {
            // Handle update
            const updatedWarehouses = warehouses.map(warehouse => {
                if (warehouse.id === selectedWarehouse?.id) {
                    return {
                        ...warehouse,
                        name: data.warehouseName,
                        location: data.location,
                        size: data.size,
                        capacity: data.capacity,
                        staffMembers: data.staffId,
                        inventories: data.inventories,
                        image: data.image instanceof File ? URL.createObjectURL(data.image) : warehouse.image
                    };
                }
                return warehouse;
            });
            setWarehouses(updatedWarehouses);
        }
        handleClose();
    };

    return (
        <div className="p-4 space-y-4">
            <TitleComponent title="Warehouse Section" addWarehouse={handleOpen}/>

            <SearchBarComponent title="Search By Warehouse ID" />

            <TableComponent
                data={warehouses}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                enableSelection={true}
                onRowSelect={(warehouse) => console.log('Selected warehouse:', warehouse)}
                rowsPerPage={5}
            />

            <PopupModalComponent
                open={open}
                handleClose={handleClose}
                title="Warehouse"
                fields={fields}
                onSubmit={handleSubmit}
                initialData={mode === 'edit' ? {
                    warehouseId: selectedWarehouse?.id,
                    warehouseName: selectedWarehouse?.name,
                    location: selectedWarehouse?.location,
                    size: selectedWarehouse?.size,
                    capacity: selectedWarehouse?.capacity,
                    staffId: selectedWarehouse?.staffMembers,
                    inventories: selectedWarehouse?.inventories,
                    image: selectedWarehouse?.image
                } : undefined}
                mode={mode}
            />
        </div>
    );
};