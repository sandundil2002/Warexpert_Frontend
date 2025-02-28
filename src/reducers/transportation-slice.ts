import {Transportation} from "../model/transportation.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {apiInstance} from "../api/api-instance.ts";
import axios from "axios";
import {toast} from "sonner";

const initialState: Transportation[] = [];

export const getTransportations = createAsyncThunk<Transportation[]>(
    "transportation/getTransportations",
    async () => {
        try {
            const response = await apiInstance.get("/transportation/get");
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
            const response = await apiInstance.post("/transportation/post", transportation);
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

export const updateTransportation = createAsyncThunk<Transportation, { id: string; transportation: Transportation }>(
    "transportation/updateTransportation",
    async ({ id, transportation }) => {
        try {
            const response = await apiInstance.patch(`/transportation/patch/${id}`, transportation);
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

export const deleteTransportation = createAsyncThunk<string, string, { rejectValue: string }>(
    "transportation/deleteTransportation",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/transportation/delete/${id}`);
            return id;
        } catch (error) {
            console.error("Error deleting transportation:", error);

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