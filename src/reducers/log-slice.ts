import {Logs} from "../model/logs.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {apiInstance} from "../api/api-instance.ts";

export const initialState: Logs[] = [];

export const getLogs = createAsyncThunk<Logs[]>(
    "log/getLogs",
    async () => {
        try {
            const response = await apiInstance.get("/logs/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addLog = createAsyncThunk<Logs, Logs>(
    "log/addLog",
    async (log) => {
        try {
            const response = await apiInstance.post("/logs/post", log);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLogs.pending, () => {
                console.log("Fetching logs...");
            })
            .addCase(getLogs.fulfilled, (state, action) => {
                action.payload.map((log:Logs) => {
                    state.push(log);
                });
            })
            .addCase(getLogs.rejected, () => {
                console.log("Error fetching logs");
            })

        builder
            .addCase(addLog.pending, () => {
                console.log("Adding log...");
            })
            .addCase(addLog.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(addLog.rejected, () => {
                console.log("Error adding log");
            })
    }
});

export default logSlice.reducer;