import React, {useState} from "react";
import {Transportation} from "../components/interfaces/transportation.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";

const sampleData: Transportation[] = [
    {
        id: "T001",
        name: "Truck 1",
        category: "Truck",
        quantity: "1",
        warehouse: "WH001",
        image: "truck1.jpg"
    },
    {
        id: "T002",
        name: "Van 1",
        category: "Van",
        quantity: "1",
        warehouse: "WH001",
        image: "van1.jpg"
    }
];

export const TransportationPage: React.FC = () => {

    const [transportations, setTransportations] = useState<Transportation[]>(sampleData);
    const [open, setOpen] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState<Transportation | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const fields = [
        {
            id: 'transportationId',
            label: 'Transportation ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'transportationName',
            label: 'Transportation Name',
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
        setSelectedTransportation(null);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedTransportation(null);
    }

    const handleEdit = (transportations: Transportation) => {
        setMode('edit');
        setSelectedTransportation(transportations);
        setOpen(true);
    }

    const handleDelete = async (transportationsId: string) => {
        const updatedTransportations = transportations.filter(transportations => transportations.id !== transportationsId);
        setTransportations(updatedTransportations);
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newTransportation: Transportation = {
                id: `T00${transportations.length + 1}`,
                name: data.transportationName,
                category: data.category,
                quantity: data.quantity,
                warehouse: data.warehouse,
                image: data.image
            };
            setTransportations([...transportations, newTransportation]);
        } else {
            const updatedTransportations = transportations.map(transportations => {
                if (transportations.id === selectedTransportation?.id) {
                    return {
                        ...transportations,
                        name: data.transportationName,
                        category: data.category,
                        quantity: data.quantity,
                        warehouse: data.warehouse,
                        image: data.image
                    };
                }
                return transportations;
            });
            setTransportations(updatedTransportations);
        }
        handleClose()
    }

    const columns: ColumnDef<Transportation>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'category', label: 'Category', align: 'left' },
        { id: 'quantity', label: 'Quantity', align: 'left' },
        { id: 'warehouse', label: 'Warehouse', align: 'left' },
        { id: 'image', label: 'Image', align: 'left' },
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Transportation Section" addNew={handleOpen} />
                <SearchBarComponent title="Search Transportation By ID" />
                <TableComponent
                    columns={columns}
                    data={transportations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableSelection={true}
                />
                <PopupModalComponent
                    open={open}
                    handleClose={handleClose}
                    title="Transportation"
                    fields={fields}
                    onSubmit={handleSubmit}
                    initialData={mode === 'edit' ? {
                        transportationId: selectedTransportation?.id,
                        transportationName: selectedTransportation?.name,
                        category: selectedTransportation?.category,
                        quantity: selectedTransportation?.quantity,
                        warehouse: selectedTransportation?.warehouse,
                        image: selectedTransportation?.image
                    } : undefined}
                    mode={mode}
                    />
            </div>
        </>
    );
};