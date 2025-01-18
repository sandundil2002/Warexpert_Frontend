import {CustomerModel} from "../models/customerModel.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: CustomerModel[] = [];

export const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        addCustomer: (state, action: PayloadAction<CustomerModel>) => {
            state.push(action.payload);
        },
        updateCustomer: (state, action: PayloadAction<CustomerModel>) => {
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