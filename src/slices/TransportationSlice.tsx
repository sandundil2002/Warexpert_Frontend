import {TransportationModel} from "../models/transportationModel.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TransportationModel[] = [];

export const transportationSlice = createSlice({
    name: "transportation",
    initialState,
    reducers: {
        addTransportation: (state, action: PayloadAction<TransportationModel>) => {
            state.push(action.payload);
        },
        updateTransportation: (state, action: PayloadAction<TransportationModel>) => {
            const index = state.findIndex((transportation) => transportation.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteTransportation: (state, action: PayloadAction<string>) => {
            return state.filter((transportation) => transportation.id !== action.payload);
        },
    },
});

export const {addTransportation, updateTransportation, deleteTransportation} = transportationSlice.actions;
export default transportationSlice.reducer;