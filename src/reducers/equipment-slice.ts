import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Equipment} from "../model/equipment.ts";
import axios from "axios";

const initialState: Equipment[] = [];

const api = axios.create({
    baseURL: "http://localhost:3000/equipment"
});

export const getEquipment = createAsyncThunk<Equipment[]>(
    "equipment/getEquipment",
    async () => {
        try {
            const response = await api.get("/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addEquipment = createAsyncThunk<Equipment, Equipment>(
    "equipment/addEquipment",
    async (equipment) => {
        try {
            const response = await api.post("/post", equipment);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const updateEquipment = createAsyncThunk<Equipment, { id: string; equipment: Equipment }>(
    "equipment/updateEquipment",
    async ({ id, equipment }) => {
        try {
            const response = await api.patch(`/patch/${id}`, equipment);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const deleteEquipment = createAsyncThunk<string, string>(
    "equipment/deleteEquipment",
    async (id) => {
        await api.delete(`/delete/${id}`);
        return id;
    }
);

const equipmentSlice = createSlice({
    name: "equipment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEquipment.pending, () => {
                console.log("Pending get equipment");
            })
            .addCase(getEquipment.fulfilled, (state, action) => {
                action.payload.map((equipment: Equipment) => {
                    state.push(equipment);
                });
            })
            .addCase(getEquipment.rejected, () => {
                console.log("Rejected get equipment");
            })

        builder
            .addCase(addEquipment.pending, () => {
                console.log("Pending add equipment");
            })
            .addCase(addEquipment.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(addEquipment.rejected, () => {
                console.log("Rejected add equipment");
            })

        builder
            .addCase(updateEquipment.pending, () => {
                console.log("Pending update equipment");
            })
            .addCase(updateEquipment.fulfilled, (state, action) => {
                const index = state.findIndex((equipment) => equipment.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
            })
            .addCase(updateEquipment.rejected, () => {
                console.log("Rejected update equipment");
            })

        builder
            .addCase(deleteEquipment.pending, () => {
                console.log("Pending delete equipment");
            })
            .addCase(deleteEquipment.fulfilled, (state, action) => {
                return state.filter((equipment) => equipment.id !== action.payload);
            })
            .addCase(deleteEquipment.rejected, () => {
                console.log("Rejected delete equipment");
            })
    },
});

export default equipmentSlice.reducer;