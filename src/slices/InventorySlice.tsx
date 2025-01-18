import {Inventory} from "../models/inventoryModel.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Inventory[] = [];

export const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        addInventory: (state, action: PayloadAction<Inventory>) => {
            state.push(action.payload);
        },
        updateInventory: (state, action: PayloadAction<Inventory>) => {
            const index = state.findIndex((inventory) => inventory.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteInventory: (state, action: PayloadAction<string>) => {
            return state.filter((inventory) => inventory.id !== action.payload);
        },
    },
});

export const { addInventory, updateInventory, deleteInventory } = inventorySlice.actions;
export default inventorySlice.reducer;