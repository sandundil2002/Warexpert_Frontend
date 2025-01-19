import React, {useMemo, useState} from "react";
import {Equipment} from "../components/interfaces/equipment.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addEquipment, deleteEquipment, updateEquipment} from "../slices/EquipmentSlice.tsx";

interface RootState {
    equipment: Equipment[];
}

export const EquipmentPage: React.FC = () => {
    const equipments = useSelector((state: RootState) => state.equipment);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const columns: ColumnDef<Equipment>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'category', label: 'Category', align: 'left' },
        { id: 'quantity', label: 'Quantity', align: 'left' },
        { id: 'warehouse', label: 'Warehouse', align: 'left' },
        { id: 'image', label: 'Image', align: 'left' },
        { id: 'actions', label: 'Actions', align: 'center' }
    ]

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
        dispatch(deleteEquipment(equipmentId));
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
            dispatch(addEquipment(newEquipment));
        } else {
            const updatedEquipment: Equipment = {
                id: data.equipmentId,
                name: data.equipmentName,
                category: data.category,
                quantity: data.quantity,
                warehouse: data.warehouse,
                image: data.image
            }
            dispatch(updateEquipment(updatedEquipment));
        }
        handleClose();
    }

    const displayedEquipments = useMemo(() => {
        if (!searchQuery) {
            return equipments;
        }
        return equipments.filter((equipment) =>
            equipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [equipments, searchQuery]);

    const handleEquipmentSelect = (equipment: Equipment | null) => {
        if (equipment) {
            setSearchQuery(equipment.id);
        } else {
            setSearchQuery('');
        }
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Equipment Section" addNew={handleOpen}/>

                <SearchBarComponent<Equipment>
                    title="Search Equipment By ID"
                    data={equipments}
                    onSelect={handleEquipmentSelect}
                />

                <TableComponent
                    columns={columns}
                    data={displayedEquipments}
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