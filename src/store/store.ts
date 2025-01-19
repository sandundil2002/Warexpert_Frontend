import {configureStore} from "@reduxjs/toolkit";
import warehouseSlice from "../slices/WarehouseSlice.tsx";
import customerSlice from "../slices/CustomerSlice.tsx";
import inventorySlice from "../slices/InventorySlice.tsx";
import employeeSlice from "../slices/SearchSlice.tsx";

export const store = configureStore({
    reducer: {
        warehouse: warehouseSlice,
        customer: customerSlice,
        inventory: inventorySlice,
        employee: employeeSlice,
    },
});