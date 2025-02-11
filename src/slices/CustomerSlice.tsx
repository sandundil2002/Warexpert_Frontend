import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {Customer} from "../components/interfaces/customer.ts";

export const initialState : Customer[] = [];

const api = axios.create({
    baseURL : "http://localhost:3000/customer"
})

export const getCustomers = createAsyncThunk<Customer[]>(
    "customer/getCustomers",
    async () => {
        try {
            const response = await api.get("/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addCustomer = createAsyncThunk<Customer, Customer>(
    "customer/addCustomer",
    async (customer) => {
        try {
            const response = await api.post("/post", customer);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const updateCustomer = createAsyncThunk<Customer, { id: string; customer: Customer }>(
    "customer/updateCustomer",
    async ({ id, customer }) => {
        try {
            const response = await api.patch(`/patch/${id}`, customer);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const deleteCustomer = createAsyncThunk<string, string>(
    "customer/deleteCustomer",
    async (id) => {
        await api.delete(`/delete/${id}`);
        return id;
    }
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, () => {
                console.log("Pending get customer:");
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                action.payload.map((customer:Customer) => {
                    state.push(customer);
                })
            })
            .addCase(getCustomers.rejected, () => {
                console.error("Failed to save customer:");
            });

        builder
            .addCase(addCustomer.pending, () => {
                console.log("Pending save customer:");
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                console.log("Customer saved successfully");
                state.push(action.payload);
            })
            .addCase(addCustomer.rejected, () => {
                console.error("Failed to save customer:");
            });

        builder
            .addCase(updateCustomer.pending, () => {
                console.log("Pending update customer:");
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                console.log("Update customer payload:", action.payload); // Log the payload
                const index = state.findIndex(customer => customer.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload; // Directly mutate the state
                }
            })
            .addCase(updateCustomer.rejected, () => {
                console.error("Failed to update customer:");
            });

        builder
            .addCase(deleteCustomer.pending, () => {
                console.log("Pending delete customer:");
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                console.log("Customer deleted successfully");
                return state.filter((customer) => customer.id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, () => {
                console.error("Failed to delete customer:");
            });
    },
});

export default customerSlice.reducer;