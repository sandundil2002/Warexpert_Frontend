import {Transportation} from "../model/transportation.ts";
import axios from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: Transportation[] = [];

const api = axios.create({
    baseURL: "http://localhost:3000/transportation"
});

export const getTransportations = createAsyncThunk<Transportation[]>(
    "transportation/getTransportations",
    async () => {
        try {
            const response = await api.get("/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addTransportation = createAsyncThunk<Transportation, Transportation>(
    "transportation/addTransportation",
    async (transportation) => {
        try {
            const response = await api.post("/post", transportation);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const updateTransportation = createAsyncThunk<Transportation, { id: string; transportation: Transportation }>(
    "transportation/updateTransportation",
    async ({ id, transportation }) => {
        try {
            const response = await api.patch(`/patch/${id}`, transportation);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const deleteTransportation = createAsyncThunk<string, string>(
    "transportation/deleteTransportation",
    async (id) => {
        await api.delete(`/delete/${id}`);
        return id;
    }
);

const transportationSlice = createSlice({
    name: "transportation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTransportations.pending, () => {
                console.log("Pending get transportations");
            })
            .addCase(getTransportations.fulfilled, (state, action) => {
                action.payload.map((transportation: Transportation) => {
                    state.push(transportation);
                });
            })
            .addCase(getTransportations.rejected, () => {
                console.log("Rejected get transportations");
            })

        builder
            .addCase(addTransportation.pending, () => {
                console.log("Pending add transportation");
            })
            .addCase(addTransportation.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(addTransportation.rejected, () => {
                console.log("Rejected add transportation");
            })

        builder
            .addCase(updateTransportation.pending, () => {
                console.log("Pending update transportation");
            })
            .addCase(updateTransportation.fulfilled, (state, action) => {
                const index = state.findIndex((transportation) => transportation.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
            })
            .addCase(updateTransportation.rejected, () => {
                console.log("Rejected update transportation");
            })

        builder
            .addCase(deleteTransportation.pending, () => {
                console.log("Pending delete transportation");
            })
            .addCase(deleteTransportation.fulfilled, (state, action) => {
                return state.filter((transportation) => transportation.id !== action.payload);
            })
            .addCase(deleteTransportation.rejected, () => {
                console.log("Rejected delete transportation");
            })
    },
});


export default transportationSlice.reducer;