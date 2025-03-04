import React, {useEffect, useMemo, useState} from "react";
import { PopupModalComponent } from "../components/popup/PopupModalComponent.tsx";
import { TitleComponent } from "../components/common/TitleComponent";
import { SearchBarComponent } from "../components/common/SearchBarComponent";
import { ColumnDef, TableComponent } from "../components/common/TableComponent";
import { Warehouse } from "../model/warehouse";
import {useDispatch, useSelector} from "react-redux";
import {addWarehouse, deleteWarehouse, getWarehouses, updateWarehouse} from "../reducers/warehouse-slice.ts";
import {AppDispatch, RootState} from "../store/store.ts";
import {Navigate} from "react-router-dom";
import {toast} from "sonner";

interface Field {
    id: string;
    label: string;
    type: "text" | "number" | "email" | "select" | "file";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
}

export const WarehousesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const warehouses = useSelector((state: RootState) => state.warehouse);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const [open, setOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (!warehouses.length) {
            dispatch(getWarehouses());
        }
    }, [dispatch, warehouses.length]);

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    const fields: Field[] = [
        {
            id: 'warehouseId',
            label: 'WarehouseModel ID',
            type: 'text',
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'warehouseName',
            label: 'Warehouse Name',
            type: 'text',
            required: true
        },
        {
            id: 'location',
            label: 'Location',
            type: 'text',
            required: true
        },
        {
            id: 'size',
            label: 'Size(Sq ft)',
            type: 'number',
            required: true
        },
        {
            id: 'capacity',
            label: 'Capacity(Units)',
            type: 'number',
            required: true
        },
        {
            id: 'image',
            label: 'Warehouse Image',
            type: 'file',
            required: true,
        }
    ];

    const columns: ColumnDef<Warehouse>[] = [
        { id: 'id', label: 'ID', align: 'center' },
        { id: 'name', label: 'Name', align: 'center' },
        { id: 'location', label: 'Location', align: 'center' },
        { id: 'size', label: 'Size(Sq ft)', align: 'center' },
        { id: 'capacity', label: 'Capacity(Units)', align: 'center' },
        { id: 'createdAt', label: 'Created', align: 'center' },
        {
            id: 'image',
            label: 'Image',
            align: 'center',
            render: (warehouse: Warehouse) => {
                const base64Image = warehouse.image
                    ? (warehouse.image.startsWith?.('data:image')
                        ? warehouse.image
                        : `data:image/png;base64,${warehouse.image}`)
                    : 'default-image.jpg';

                return (
                    <img
                        src={base64Image}
                        alt={`${warehouse.name} image`}
                        className="w-16 h-16 rounded object-cover"
                    />
                );
            },
        },
        { id: 'actions', label: 'Actions', align: 'center' },
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
        const deleteWare = await dispatch(deleteWarehouse(warehouseId));
        if (deleteWare.meta.requestStatus === 'fulfilled') {
            toast.warning("Warehouse deleted successfully");
        } else {
            toast.error("Failed to delete warehouse");
        }
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
            console.log("No valid file received. Using existing image.");
            imageBase64 = selectedWarehouse?.image || '';
        }

        const warehouseData: Warehouse = {
            id: mode === 'create' ? `W00${warehouses.length + 1}` : selectedWarehouse?.id || '',
            name: data.warehouseName,
            location: data.location,
            size: data.size,
            capacity: data.capacity,
            image: imageBase64,
        };

        if (mode === 'create') {
            const addWare = await dispatch(addWarehouse(warehouseData));
            if (addWare.meta.requestStatus === 'fulfilled') {
                toast.success("Warehouse added successfully");
            } else {
                toast.error("Failed to add warehouse");
            }
        } else if (selectedWarehouse) {
            const updateWare = await dispatch(updateWarehouse({ id: selectedWarehouse.id, warehouse: warehouseData }));
            if (updateWare.meta.requestStatus === 'fulfilled') {
                toast.info("Warehouse updated successfully");
            } else {
                toast.error("Failed to update warehouse");
            }
        }

        handleClose();
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const displayedWarehouses = useMemo(() => {
        if (!searchQuery) return warehouses;

        return warehouses.filter(
            warehouse =>
            warehouse.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [warehouses, searchQuery]);

    const handleWarehouseSelect = (warehouse: Warehouse | null) => {
        if (warehouse) {
            setSearchQuery(warehouse.id);
        } else {
            setSearchQuery('');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <TitleComponent title="Warehouse Section" addNew={handleOpen}/>

            <SearchBarComponent<Warehouse>
                title="Search WarehouseModel By ID"
                data={warehouses}
                onSelect={handleWarehouseSelect}
            />

            <TableComponent
                data={displayedWarehouses}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                enableSelection={true}
            />

            <PopupModalComponent
                open={open}
                handleClose={handleClose}
                title="WarehouseModel"
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
                } : undefined }
                mode={mode}
            />
        </div>
    );
};