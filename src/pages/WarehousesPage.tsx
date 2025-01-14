import {useState} from "react";
import {InputPopupModalComponent} from "../components/popup/InputPopupModalComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";

export const WarehousesPage = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

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
            required: true
        },
        {
            id: 'inventories',
            label: 'Inventories',
            type: 'select' as const,
            required: true
        },
        {
            id: 'image',
            label: 'Warehouse Image',
            type: 'file' as const,
            required: true
        }
    ];


    const handleSubmit = (data: Record<string, any>) => {
        console.log('Form data:', data);
        // Handle form submission
    };

    return (
        <>
            <TitleComponent title="Warehouse Section" addWarehouse={handleOpen}/>
            <InputPopupModalComponent
                open={open} handleClose={() => setOpen(false)}
                title="Add New Warehouse"
                fields={fields}
                onSubmit={handleSubmit}
            />
            <SearchBarComponent title="Search By Warehouse ID" />
        </>
    );
};