import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "../api/api-instance";

export const fetchStockSummary = createAsyncThunk(
    "report/fetchStockSummary",
    async () => {
        const response = await apiInstance.get("/reports/stock-summary");
        return response.data;
    }
);

export const fetchLowCapacityAlerts = createAsyncThunk(
    "report/fetchLowCapacityAlerts",
    async () => {
        const response = await apiInstance.get("/reports/low-capacity-alerts");
        return response.data;
    }
);

interface ReportState {
    stockSummary: [];
    lowCapacityAlerts: [];
    loading: boolean;
    error: string | null;
}

const initialState: ReportState = {
    stockSummary: [],
    lowCapacityAlerts: [],
    loading: false,
    error: null,
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.stockSummary = action.payload;
            })
            .addCase(fetchStockSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch stock summary.";
            });

        builder
            .addCase(fetchLowCapacityAlerts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLowCapacityAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.lowCapacityAlerts = action.payload;
            })
            .addCase(fetchLowCapacityAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch low capacity alerts.";
            });
    },
});

export default reportSlice.reducer;