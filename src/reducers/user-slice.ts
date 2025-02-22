import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    jwt_token: null as string | null,
    refresh_token: null as string | null,
    username: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: "",
};

const api = axios.create({
    baseURL: "http://localhost:3000/auth",
});

export const registerUser = createAsyncThunk(
    'user/register',
    async (user, { rejectWithValue }) => {
        try {
            const response = await api.post('/signup', { user }, { withCredentials: true });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (user, { rejectWithValue }) => {
        try {
            const response = await api.post('/signin', { user }, { withCredentials: true });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const refreshToken = createAsyncThunk(
    'user/refreshToken',
    async (refreshToken: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/refresh-token', { refreshToken }, { withCredentials: true });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Token refresh failed");
        }
    }
);

export const otpVerification = createAsyncThunk(
    'user/otpVerification',
    async ({ user, otp }: { user: any; otp: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/verify-otp', { user, otp }, { withCredentials: true });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "OTP verification failed");
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOutUser(state) {
            state.isAuthenticated = false;
            state.jwt_token = null;
            state.refresh_token = null;
            state.username = null;
        },
        updateTokens(state, action) {
            state.jwt_token = action.payload.jwt_token;
            state.refresh_token = action.payload.refresh_token;
        },
    },
    extraReducers(builder) {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
        builder.addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = "";
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });

        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.jwt_token = action.payload.accessToken;
            state.refresh_token = action.payload.refreshToken;
            state.username = action.payload.username;
            state.error = "";
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });

        builder.addCase(refreshToken.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.jwt_token = action.payload.accessToken;
            state.refresh_token = action.payload.refreshToken;
            state.error = "";
        });
        builder.addCase(refreshToken.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });

        builder.addCase(otpVerification.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
        builder.addCase(otpVerification.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.jwt_token = action.payload.accessToken;
            state.refresh_token = action.payload.refreshToken;
            state.error = "";
        });
        builder.addCase(otpVerification.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });
    },
});

export const { logOutUser, updateTokens } = userSlice.actions;
export default userSlice.reducer;