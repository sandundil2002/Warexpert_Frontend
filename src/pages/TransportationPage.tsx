import React, {useMemo, useState} from "react";
import {Transportation} from "../components/interfaces/transportation.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addTransportation, deleteTransportation, updateTransportation} from "../slices/TransportationSlice.tsx";

interface RootState {
    transportation: Transportation[];
}

export const TransportationPage: React.FC = () => {
    const transportations = useSelector((state: RootState) => state.transportation);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState<Transportation | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const columns: ColumnDef<Transportation>[] = [
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'name', label: 'Name', align: 'left' },
        { id: 'category', label: 'Category', align: 'left' },
        { id: 'quantity', label: 'Quantity', align: 'left' },
        { id: 'warehouse', label: 'Warehouse', align: 'left' },
        { id: 'image', label: 'Image', align: 'left' },
        { id: 'actions', label: 'Actions', align: 'center' }
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
        dispatch(deleteTransportation(transportationsId));
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
            dispatch(addTransportation(newTransportation));
        } else {
            const updatedTransportation: Transportation = {
                id: data.transportationId,
                name: data.transportationName,
                category: data.category,
                quantity: data.quantity,
                warehouse: data.warehouse,
                image: data.image
            };
            dispatch(updateTransportation(updatedTransportation));
        }
        handleClose()
    }

    const displayTransportations = useMemo(() => {
        if (!searchQuery) {
            return transportations;
        }
        return transportations.filter((transportation) =>
            transportation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transportation.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [transportations, searchQuery]);

    const handleTransportationSelect = (transportation: Transportation | null) => {
        if (transportation) {
            setSearchQuery(transportation.id);
        } else {
            setSearchQuery('');
        }
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Transportation Section" addNew={handleOpen} />

                <SearchBarComponent<Transportation>
                    title="Search Transportation By ID"
                    data={transportations}
                    onSelect={handleTransportationSelect}
                />

                <TableComponent
                    columns={columns}
                    data={displayTransportations}
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