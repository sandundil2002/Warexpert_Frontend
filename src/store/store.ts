import {configureStore} from "@reduxjs/toolkit";
import warehouseSlice from "../reducers/warehouse-slice.ts";
import customerSlice from "../reducers/customer-slice.ts";
import inventorySlice from "../reducers/inventory-slice.ts";
import employeeSlice from "../reducers/employee-slice.ts";
import logSlice from "../reducers/log-slice.ts";
import transportationSlice from "../reducers/transportation-slice.ts";
import equipmentSlice from "../reducers/equipment-slice.ts";

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;