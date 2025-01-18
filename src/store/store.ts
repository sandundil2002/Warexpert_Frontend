import {configureStore} from "@reduxjs/toolkit";
import warehouseSlice from "../slices/WarehouseSlice.tsx";

export const store = configureStore({
    reducer: {
        warehouse: warehouseSlice,
    },
});