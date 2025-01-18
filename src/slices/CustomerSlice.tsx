import {Customer} from "../models/customer.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Customer[] = [];

export const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        addCustomer: (state, action: PayloadAction<Customer>) => {
            state.push(action.payload);
        },
        updateCustomer: (state, action: PayloadAction<Customer>) => {
            const index = state.findIndex((customer) => customer.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteCustomer: (state, action: PayloadAction<string>) => {
            return state.filter((customer) => customer.id !== action.payload);
        },
    },
});

export const {addCustomer, updateCustomer, deleteCustomer} = customerSlice.actions;
export default customerSlice.reducer;