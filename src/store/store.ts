import {configureStore} from "@reduxjs/toolkit";
import warehouseSlice from "../slices/WarehouseSlice.tsx";
import customerSlice from "../slices/CustomerSlice.tsx";
import inventorySlice from "../slices/InventorySlice.tsx";
import employeeSlice from "../slices/SearchSlice.tsx";
import logSlice from "../slices/LogSlice.tsx";
import transportationSlice from "../slices/TransportationSlice.tsx";
import equipmentSlice from "../slices/EquipmentSlice.tsx";

export const store = configureStore({
    reducer: {
        warehouse: warehouseSlice,
        customer: customerSlice,
        inventory: inventorySlice,
        employee: employeeSlice,
        log: logSlice,
        transportation: transportationSlice,
        equipment: equipmentSlice,
    },
});