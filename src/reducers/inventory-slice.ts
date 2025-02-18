import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Inventory} from "../model/inventory.ts";
import axios from "axios";

const initialState: Inventory[] = [];

const api = axios.create({
    baseURL: "http://localhost:3000/inventory",
});

export const getInventory = createAsyncThunk<Inventory[]>(
    "inventory/getInventory",
    async () => {
        try {
            const response = await api.get("/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addInventory = createAsyncThunk<Inventory, Inventory>(
    "inventory/addInventory",
    async (inventory) => {
        try {
            const response = await api.post("/post", inventory);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const updateInventory = createAsyncThunk<Inventory, {id: string; inventory:Inventory}>(
    "inventory/updateInventory",
    async ({ id, inventory}) => {
        try {
            const response = await api.patch(`/patch/${id}`, inventory);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const deleteInventory = createAsyncThunk<string, string>(
    "inventory/deleteInventory",
    async (id) => {
        await api.delete(`/delete/${id}`);
        return id;
    }
);

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInventory.pending, () => {
                console.log("Fetching Inventory...");
            })
            .addCase(getInventory.fulfilled, (state, action) => {
                action.payload.map((inventory: Inventory) => {
                    state.push(inventory);
                })
            })
            .addCase(getInventory.rejected, () => {
                console.log("Error fetching Inventory");
            })

        builder
            .addCase(addInventory.pending, () => {
                console.log("Adding Inventory...");
            })
            .addCase(addInventory.fulfilled, (state, action) => {
                console.log("Inventory added successfully");
                state.push(action.payload);
            })
            .addCase(addInventory.rejected, () => {
                console.log("Error adding Inventory");
            })

        builder
            .addCase(updateInventory.pending, () => {
                console.log("Updating Inventory...");
            })
            .addCase(updateInventory.fulfilled, (state, action) => {
                console.log("Inventory updated successfully");
                const index = state.findIndex((inventory) => inventory.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
            })
            .addCase(updateInventory.rejected, () => {
                console.log("Error updating Inventory");
            })

        builder
            .addCase(deleteInventory.pending, () => {
                console.log("Deleting Inventory...");
            })
            .addCase(deleteInventory.fulfilled, (state, action) => {
                console.log("Inventory deleted successfully");
                return state.filter((inventory) => inventory.id !== action.payload);
            })
            .addCase(deleteInventory.rejected, () => {
                console.log("Error deleting Inventory");
            })
    }
})


export default inventorySlice.reducer;