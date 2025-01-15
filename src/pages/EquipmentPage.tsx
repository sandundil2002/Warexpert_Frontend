import React, {useState} from "react";
import {Equipment} from "../components/interfaces/equipment.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";

const sampleData: Equipment[] = [
    {
        id: "EQ001",
        name: "Laptop",
        category: "IT",
        quantity: "10",
        warehouse: "WH001",
        image: "laptop.jpg"
    },
    {
        id: "EQ002",
        name: "Forklift",
        category: "Machinery",
        quantity: "2",
        warehouse: "WH001",
        image: "forklift.jpg"
    }
]

export const EquipmentPage: React.FC = () => {

    const [equipments, setEquipments] = useState<Equipment[]>(sampleData);
    const [open, setOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const fields = [
        {
            id: 'equipmentId',
            label: 'Equipment ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'equipmentName',
            label: 'Equipment Name',
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
            type: 'text' as const,
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

    const handleOpen = () => {
        setMode('create');
        setSelectedEquipment(null);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedEquipment(null);
    }

    const handleEdit = (equipment: Equipment) => {
        setMode('edit');
        setSelectedEquipment(equipment);
        setOpen(true);
    }

    const handleDelete = async (equipmentId: string) => {
        const updatedEquipments = equipments.filter(equipment => equipment.id !== equipmentId);
        setEquipments(updatedEquipments);
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newEquipment: Equipment = {
                id: `EQ00${equipments.length + 1}`,
                name: data.equipmentName,
                category: data.category,
                quantity: data.quantity,
                warehouse: data.warehouse,
                image: data.image
            }
            setEquipments([...equipments, newEquipment]);
        } else {
            const updatedEquipments = equipments.map(equipment => {
                if (equipment.id === selectedEquipment?.id) {
                    return {
                        ...equipment,
                        name: data.equipmentName,
                        category: data.category,
                        quantity: data.quantity,
                        warehouse: data.warehouse,
                        image: data.image
                    }
                }
                return equipment;
            });
            setEquipments(updatedEquipments);
        }
        handleClose();
    }

    const columns: ColumnDef<Equipment>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'category', label: 'Category', align: 'left' },
        { id: 'quantity', label: 'Quantity', align: 'left' },
        { id: 'warehouse', label: 'Warehouse', align: 'left' },
        { id: 'image', label: 'Image', align: 'left' },
        { id: 'actions', label: 'Actions', align: 'center' }
    ]

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Equipment Section" addNew={handleOpen}/>
                <SearchBarComponent title="Search Equipment By ID"/>
                <TableComponent
                    columns={columns}
                    data={equipments}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableSelection={true}
                />
                <PopupModalComponent
                    open={open}
                    handleClose={handleClose}
                    title="Equipment"
                    fields={fields}
                    onSubmit={handleSubmit}
                    initialData={mode === 'edit' ? {
                        equipmentId: selectedEquipment?.id,
                        equipmentName: selectedEquipment?.name,
                        category: selectedEquipment?.category,
                        quantity: selectedEquipment?.quantity,
                        warehouse: selectedEquipment?.warehouse,
                        image: selectedEquipment?.image
                    } : undefined}
                    mode={mode}
                />
            </div>
        </>
    );
};