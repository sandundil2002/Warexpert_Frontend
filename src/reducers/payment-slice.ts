import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {apiInstance} from "../api/api-instance.ts";

export const createPayment = createAsyncThunk(
    "payment/createPayment",
    async (data: { customerId: string; inventoryItems: { inventoryItemId: string; quantity: number }[]; totalAmount: number }) => {
        const response = await apiInstance.post("/payment/post", data);
        return response.data;
    }
);

export const getAllPayments = createAsyncThunk(
    "payment/getAllPayments",
    async () => {
        const response = await apiInstance.get("/payment/get");
        return response.data;
    }
);

interface PaymentState {
    payments: any[];
    push: (payment: any) => void;
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    payments: [],
    push: () => {},
    loading: false,
    error: null,
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.push(action.payload);
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create payment.";
            });

        builder
            .addCase(getAllPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(getAllPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch payments.";
            });
    },
});

export default paymentSlice.reducer;