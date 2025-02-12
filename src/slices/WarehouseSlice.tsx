import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Warehouse} from "../components/interfaces/warehouse.ts";
import axios from "axios";

const initialState: Warehouse[] = [];

const api = axios.create({
    baseURL: "http://localhost:3000/warehouse",
});

export const getWarehouses = createAsyncThunk<Warehouse[]>(
    "warehouse/getWarehouses",
    async () => {
        try {
            const response = await api.get("/get");
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
            const response = await api.post(`/post`, warehouse);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const updateWarehouse = createAsyncThunk<Warehouse, {id: string; warehouse: Warehouse}>(
    "warehouse/updateWarehouse",
    async ({id, warehouse}) => {
        try {
            const response = await api.patch(`/patch/${id}`, warehouse);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const deleteWarehouse = createAsyncThunk<string, string>(
    "warehouse/deleteWarehouse",
    async (id) =>{
        await api.delete(`/delete/${id}`);
        return id;
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