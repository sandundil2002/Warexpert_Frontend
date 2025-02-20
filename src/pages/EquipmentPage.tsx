import React, {useEffect, useMemo, useState} from "react";
import {Equipment} from "../model/equipment.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addEquipment, deleteEquipment, getEquipment, updateEquipment} from "../reducers/equipment-slice.ts";
import {AppDispatch, RootState} from "../store/store.ts";
import {getWarehouses} from "../reducers/warehouse-slice.ts";
import {Warehouse} from "../model/warehouse.ts";
import {Employee} from "../model/employee.ts";
import {getEmployees} from "../reducers/employee-slice.ts";
import {Navigate} from "react-router-dom";

interface Field {
    id: string;
    label: string;
    type: "text" | "select";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: { value: string; label: string }[];
}

export const EquipmentPage: React.FC = () => {
    const equipments = useSelector((state: RootState) => state.equipment);
    const warehouses = useSelector((state: RootState) => state.warehouse);
    const employees = useSelector((state: RootState) => state.employee);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (!equipments.length) {
            dispatch(getEquipment());
        }
    }, [dispatch, equipments.length]);

    useEffect(() => {
        if (!warehouses.length) {
            dispatch(getWarehouses());
        }
    }, [dispatch, warehouses.length]);

    useEffect(() => {
        if (!employees.length) {
            dispatch(getEmployees());
        }
    }, [dispatch, employees.length]);

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    const fields: Field[] = [
        {
            id: 'equipmentId',
            label: 'Equipment ID',
            type: 'text',
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'type',
            label: 'Equipment Type',
            type: 'select',
            required: true,
            options: [
                { value: 'FORKLIFT', label: 'Forklift' },
                { value: 'PALLET_JACK', label: 'Pallet Jack' },
                { value: 'CONVEYOR', label: 'Conveyor Belt' },
                { value: 'RACK', label: 'Storage Rack' },
                { value: 'SCANNER', label: 'Barcode Scanner' },
                { value: 'PACKAGING_EQUIPMENT', label: 'Packaging Equipment' },
                { value: 'HAND_TRUCK', label: 'Hand Truck/Dolly' },
                { value: 'CRANE', label: 'Overhead Crane' },
                { value: 'SORTING_MACHINE', label: 'Sorting Machine' },
                { value: 'OTHER', label: 'Other' },
            ],
        },
        {
            id: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            options: [
                { value: 'MATERIAL_HANDLING', label: 'Material Handling' },
                { value: 'STORAGE', label: 'Storage Solutions' },
                { value: 'PACKAGING', label: 'Packaging & Shipping' },
                { value: 'AUTOMATION', label: 'Automation & Robotics' },
                { value: 'SAFETY', label: 'Safety Equipment' },
                { value: 'INVENTORY_MANAGEMENT', label: 'Inventory Management' },
                { value: 'MAINTENANCE', label: 'Maintenance Tools' },
                { value: 'TRANSPORTATION', label: 'Transportation Equipment' },
                { value: 'OTHER', label: 'Other' },
            ],
        },
        {
            id: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: [
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'IN_USE', label: 'In Use' },
                { value: 'REPAIR', label: 'Repair' },
                { value: 'OTHER', label: 'Other' },
            ],
        },
        {
            id: 'warehouseId',
            label: 'Warehouse Name',
            type: 'select',
            required: true,
            options: warehouses.map((warehouse: Warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
            })),
        },
        {
            id: 'staffId',
            label: 'Employee ID',
            type: 'select',
            required: true,
            options: employees.map((employee: Employee) => ({
                value: employee.id,
                label: employee.name,
            })),
        }
    ];

    const columns: ColumnDef<Equipment>[] = [
        { id: 'id', label: 'ID', align: 'center' },
        { id: 'type', label: 'Type', align: 'center' },
        { id: 'category', label: 'Category', align: 'center' },
        { id: 'status', label: 'Status', align: 'center' },
        { id: 'warehouseId', label: 'Warehouse', align: 'center' },
        { id: 'staffId', label: 'Employee', align: 'center' },
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
        await dispatch(deleteEquipment(equipmentId));
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newEquipment: Equipment = {
                id: `EQ00${equipments.length + 1}`,
                type: data.type,
                category: data.category,
                status: data.status,
                warehouseId: data.warehouseId,
                staffId: data.staffId
            }
            await dispatch(addEquipment(newEquipment));
        } else if (selectedEquipment) {
            const updatedEquipment: Equipment = {
                id: selectedEquipment.equipmentId,
                type: data.type,
                category: data.category,
                status: data.status,
                warehouseId: data.warehouseId,
                staffId: data.staffId
            }
            await dispatch(updateEquipment({ id: selectedEquipment.id, equipment: updatedEquipment }));
        }
        handleClose();
    }

    const displayedEquipments = useMemo(() => {
        if (!searchQuery) {
            return equipments;
        }
        return equipments.filter((equipment) =>
            equipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            equipment.type.toLowerCase().includes(searchQuery.toLowerCase())
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
                        type: selectedEquipment?.type,
                        category: selectedEquipment?.category,
                        status: selectedEquipment?.status,
                        warehouseId: selectedEquipment?.warehouseId,
                        staffId: selectedEquipment?.staffId
                    } : undefined}
                    mode={mode}
                />
            </div>
        </>
    );
};