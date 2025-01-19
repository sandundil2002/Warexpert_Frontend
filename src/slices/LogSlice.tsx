import {LogsModel} from "../models/logModel.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: LogsModel[] = [];

export const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        addLog: (state, action: PayloadAction<LogsModel>) => {
            state.push(action.payload);
        },
        updateLog: (state, action: PayloadAction<LogsModel>) => {
            const index = state.findIndex((log) => log.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteLog: (state, action: PayloadAction<string>) => {
            return state.filter((log) => log.id !== action.payload);
        },
    },
});

export const {addLog, updateLog, deleteLog} = logSlice.actions;
export default logSlice.reducer;