import React, {useEffect, useMemo, useState} from "react";
import {Transportation} from "../model/transportation.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {
    addTransportation,
    deleteTransportation,
    getTransportations,
    updateTransportation
} from "../reducers/transportation-slice.ts";
import {AppDispatch, RootState} from "../store/store.ts";
import {getEmployees} from "../reducers/employee-slice.ts";
import {Employee} from "../model/employee.ts";
import {Navigate} from "react-router-dom";
import {toast} from "sonner";

interface Field {
    id: string;
    label: string;
    type: "text" | "select";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: { value: string; label: string }[];
}

export const TransportationPage: React.FC = () => {
    const transportations = useSelector((state: RootState) => state.transportation);
    const employees = useSelector((state: RootState) => state.employee);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState<Transportation | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (!transportations.length) {
            dispatch(getTransportations());
        }
    }, [dispatch, transportations.length]);

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
            id: 'transportationId',
            label: 'Transportation ID',
            type: 'text',
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'type',
            label: 'Transportation Type',
            type: 'select',
            required: true,
            options : [
                { value: 'Truck', label: 'Truck' },
                { value: 'Van', label: 'Van' },
                { value: 'Car', label: 'Car' },
                { value: 'Bike', label: 'Bike' },
                { value: 'Other', label: 'Other' }
            ]
        },
        {
            id: 'capacity',
            label: 'Capacity',
            type: 'text',
            required: true
        },
        {
            id: 'numberPlate',
            label: 'Number Plate',
            type: 'text',
            required: true
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

    const columns: ColumnDef<Transportation>[] = [
        { id: 'id', label: 'ID', align: 'center' },
        { id: 'type', label: 'Type', align: 'center' },
        { id: 'capacity', label: 'Capacity', align: 'center' },
        { id: 'numberPlate', label: 'Number Plate', align: 'center' },
        { id: 'status', label: 'Status', align: 'center' },
        { id: 'driverId', label: 'Driver', align: 'center' },
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
        await dispatch(deleteTransportation(transportationsId));
        toast.warning("Transportation deleted successfully");
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newTransportation: Transportation = {
                id: `T00${transportations.length + 1}`,
                type: data.type,
                capacity: data.capacity,
                numberPlate: data.numberPlate,
                status: data.status,
                driverId: data.staffId
            };
            await dispatch(addTransportation(newTransportation));
            toast.success("Transportation added successfully");
        } else if (selectedTransportation) {
            const updatedTransportation: Transportation = {
                id: selectedTransportation.id,
                type: data.type,
                capacity: data.capacity,
                numberPlate: data.numberPlate,
                status: data.status,
                driverId: data.staffId
            };
            await dispatch(updateTransportation({ id: selectedTransportation.id, transportation: updatedTransportation }));
            toast.success("Transportation updated successfully");
        }
        handleClose()
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const displayTransportations = useMemo(() => {
        if (!searchQuery) {
            return transportations;
        }
        return transportations.filter((transportation) =>
            transportation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transportation.type.toLowerCase().includes(searchQuery.toLowerCase())
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
                        type: selectedTransportation?.type,
                        capacity: selectedTransportation?.capacity,
                        numberPlate: selectedTransportation?.numberPlate,
                        status: selectedTransportation?.status,
                        staffId: selectedTransportation?.driverId
                    } : undefined}
                    mode={mode}
                    />
            </div>
        </>
    );
};