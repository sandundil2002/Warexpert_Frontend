import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Warehouse} from "../model/warehouse.ts";
import {apiInstance} from "../api/api-instance.ts";
import {toast} from "sonner";
import axios from "axios";

const initialState: Warehouse[] = [];

export const getWarehouses = createAsyncThunk<Warehouse[]>(
    "warehouse/getWarehouses",
    async () => {
        try {
            const response = await apiInstance.get("/warehouse/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addWarehouse = createAsyncThunk<Warehouse, Warehouse>(
    "warehouse/addWarehouse",
    async (warehouse) => {
        try {
            const response = await apiInstance.post(`/warehouse/post`, warehouse);
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

export const updateWarehouse = createAsyncThunk<Warehouse, {id: string; warehouse: Warehouse}>(
    "warehouse/updateWarehouse",
    async ({id, warehouse}) => {
        try {
            const response = await apiInstance.patch(`/warehouse/patch/${id}`, warehouse);
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

export const deleteWarehouse = createAsyncThunk<string, string, { rejectValue: string }>(
    "warehouse/deleteWarehouse",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/warehouse/delete/${id}`);
            return id;
        } catch (error) {
            console.error("Error deleting warehouse:", error);

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

const warehouseSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWarehouses.pending, () => {
                console.log("Pending get Warehouses");
            })
            .addCase(getWarehouses.fulfilled, (state, action) => {
                action.payload.map((warehouse: Warehouse) => {
                    state.push(warehouse);
                })
            })
            .addCase(getWarehouses.rejected, () => {
                console.error("Error fetching warehouses");
            })

        builder
            .addCase(addWarehouse.pending, () => {
                console.log("Pending add warehouse");
            })
            .addCase(addWarehouse.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(addWarehouse.rejected, () => {
                console.error("Error adding warehouse");
            })

        builder
            .addCase(updateWarehouse.pending, () => {
                console.log("Pending update warehouse");
            })
            .addCase(updateWarehouse.fulfilled, (state, action) => {
                const index = state.findIndex((warehouse) => warehouse.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
            })
            .addCase(updateWarehouse.rejected, () => {
                console.error("Error updating warehouse");
            })

        builder
            .addCase(deleteWarehouse.pending, () => {
                console.log("Pending delete warehouse");
            })
            .addCase(deleteWarehouse.fulfilled, (state, action) => {
                return state.filter((warehouse) => warehouse.id !== action.payload);
            })
            .addCase(deleteWarehouse.rejected, () => {
                console.error("Error deleting warehouse");
            })
    }
})

export default warehouseSlice.reducer;