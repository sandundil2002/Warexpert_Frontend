import {useState} from "react";
import {InputPopupModalComponent} from "../components/popup/InputPopupModalComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";

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
            placeholder: 'Enter warehouse name',
            required: true
        },
        {
            id: 'location',
            label: 'Location',
            type: 'text' as const,
            placeholder: 'Enter location',
            required: true
        },
        {
            id: 'size',
            label: 'Size',
            type: 'number' as const,
            placeholder: 'Enter size(sqft)',
            required: true
        },
        {
            id: 'capacity',
            label: 'Capacity',
            type: 'number' as const,
            placeholder: 'Enter capacity(pallets)',
            required: true
        },
        {
            id: 'staffId',
            label: 'Staff ID',
            type: 'text' as const,
            placeholder: 'Enter allocated staff ID',
            required: true
        },
        {
            id: 'inventories',
            label: 'Inventories',
            type: 'text' as const,
            placeholder: 'Enter inventories',
            required: true
        },
        {
            id: 'image',
            label: 'Image URL',
            type: 'text' as const,
            placeholder: 'Enter image URL',
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
        </>
    );
};