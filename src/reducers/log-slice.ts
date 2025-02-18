import {Logs} from "../model/logs.ts";
import axios from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const initialState: Logs[] = [];

const api = axios.create({
    baseURL : "http://localhost:3000/logs"
});

export const getLogs = createAsyncThunk<Logs[]>(
    "log/getLogs",
    async () => {
        try {
            const response = await api.get("/get");
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
            const response = await api.post("/post", log);
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