import {configureStore} from "@reduxjs/toolkit";
import warehouseReducer from "../reducers/warehouse-slice.ts";
import customerReducer from "../reducers/customer-slice.ts";
import inventoryReducer from "../reducers/inventory-slice.ts";
import employeeReducer from "../reducers/employee-slice.ts";
import logReducer from "../reducers/log-slice.ts";
import transportationReducer from "../reducers/transportation-slice.ts";
import equipmentReducer from "../reducers/equipment-slice.ts";
import userReducer from "../reducers/user-slice.ts";
import {injectStore} from "../api/api-instance.ts";

export const store = configureStore({
    reducer: {
        warehouse: warehouseReducer,
        customer: customerReducer,
        inventory: inventoryReducer,
        employee: employeeReducer,
        log: logReducer,
        transportation: transportationReducer,
        equipment: equipmentReducer,
        user: userReducer,
    },
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;