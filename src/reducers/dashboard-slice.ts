import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {Inventory} from "../model/inventory.ts";
import {Equipment} from "../model/equipment.ts";
import {Warehouse} from "../model/warehouse.ts";
import {Employee} from "../model/employee.ts";
import {Transportation} from "../model/transportation.ts";
import {Customer} from "../model/customer.ts";
import {apiInstance} from "../api/api-instance.ts";

interface DashboardState {
    inventory: Inventory[];
    equipment: Equipment[];
    warehouses: Warehouse[];
    staff: Employee[];
    transportation: Transportation[];
    customers: Customer[];
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    inventory: [],
    equipment: [],
    warehouses: [],
    staff: [],
    transportation: [],
    customers: [],
    loading: false,
    error: null,
};

export const fetchInventory = createAsyncThunk("dashboard/fetchInventory", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get("/inventory/get");
        return response.data;
    } catch (error) {
        console.log("error", error);
        return rejectWithValue("Failed to fetch inventory data");
    }
});

export const fetchEquipment = createAsyncThunk("dashboard/fetchEquipment", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get("/equipment/get");
        return response.data;
    } catch (error) {
        console.log("error", error);
        return rejectWithValue("Failed to fetch equipment data");
    }
});

export const fetchWarehouses = createAsyncThunk("dashboard/fetchWarehouses", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get("/warehouse/get");
        return response.data;
    } catch (error) {
        console.log("error", error);
        return rejectWithValue("Failed to fetch warehouse data");
    }
});

export const fetchStaff = createAsyncThunk("dashboard/fetchStaff", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get("/staff/get");
        return response.data;
    } catch (error) {
        console.log("error", error);
        return rejectWithValue("Failed to fetch staff data");
    }
});

export const fetchTransportation = createAsyncThunk("dashboard/fetchTransportation", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get("/transportation/get");
        return response.data;
    } catch (error) {
        console.log("error", error);
        return rejectWithValue("Failed to fetch transportation data");
    }
});

export const fetchCustomers = createAsyncThunk("dashboard/fetchCustomers", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get("/customer/get");
        return response.data;
    } catch (error) {
        console.log("error", error);
        return rejectWithValue("Failed to fetch customer data");
    }
});

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.inventory = action.payload || [];
                state.loading = false;
            })
            .addCase(fetchEquipment.fulfilled, (state, action) => {
                state.equipment = action.payload || [];
                state.loading = false;
            })
            .addCase(fetchWarehouses.fulfilled, (state, action) => {
                state.warehouses = action.payload || [];
                state.loading = false;
            })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.staff = action.payload || [];
                state.loading = false;
            })
            .addCase(fetchTransportation.fulfilled, (state, action) => {
                state.transportation = action.payload || [];
                state.loading = false;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.customers = action.payload || [];
                state.loading = false;
            })
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    // @ts-ignore
                    state.error = action.payload as string || "An error occurred";
                }
            );
    },
});

export default dashboardSlice.reducer;