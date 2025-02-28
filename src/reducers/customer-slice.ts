import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {Customer} from "../model/customer.ts";
import {apiInstance} from "../api/api-instance.ts";
import axios from "axios";
import {toast} from "sonner";

export const initialState : Customer[] = [];

export const getCustomers = createAsyncThunk<Customer[]>(
    "customer/getCustomers",
    async () => {
        try {
            const response = await apiInstance.get("/customer/get");
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
            const response = await apiInstance.post("/customer/post", customer);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    toast.error("You are not authorized to perform this action");
                } else {
                    console.log("error", error);
                }
            }
        }
    }
);

export const updateCustomer = createAsyncThunk<Customer, { id: string; customer: Customer }>(
    "customer/updateCustomer",
    async ({ id, customer }) => {
        try {
            const response = await apiInstance.patch(`/customer/patch/${id}`, customer);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    toast.error("You are not authorized to perform this action");
                } else {
                    console.log("error", error);
                }
            }
        }
    }
);

export const deleteCustomer = createAsyncThunk<string, string, { rejectValue: string }>(
    "customer/deleteCustomer",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/customer/delete/${id}`);
            return id;
        } catch (error) {
            console.log("error", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    toast.error("You are not authorized to perform this action");
                }
                return rejectWithValue(error.response.data?.message || "An error occurred while deleting.");
            }
            return rejectWithValue("Network error or server unavailable.");
        }
    }
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, () => {
                console.log("Pending get customers");
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                action.payload.map((customer:Customer) => {
                    state.push(customer);
                });
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
                const index = state.findIndex(customer => customer.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
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
                return state.filter((customer) => customer.id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, () => {
                console.error("Failed to delete customer:");
            });
    },
});

export default customerSlice.reducer;