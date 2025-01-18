import {Warehouse} from "../models/warehouse.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Warehouse[] = []

const warehouseSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {
        addWarehouse: (state, action: PayloadAction<Warehouse>) => {
            state.push(action.payload);
        },
        updateWarehouse: (state, action: PayloadAction<Warehouse>) => {
            const index = state.findIndex((warehouse) => warehouse.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteWarehouse: (state, action: PayloadAction<string>) => {
            return state.filter((warehouse) => warehouse.id !== action.payload);
        },
    },
});

export const {addWarehouse, updateWarehouse, deleteWarehouse} = warehouseSlice.actions;
export default warehouseSlice.reducer;