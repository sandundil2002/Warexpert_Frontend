import axios from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {User} from "../model/user.ts";

const initialState = {
    jwt_token: null,
    refresh_token: null,
    username: null,
    isAuthenticated: false,
    loading: false,
    error: '',
}

const api = axios.create({
    baseURL: "http://localhost:3000/auth"
});

export const registerUser = createAsyncThunk(
    'user/register',
    async (user: User) => {
        try {
            const response = await api.post('/signup', {user}, {withCredentials: true});
            if (response.data || response.data.success) {
                return response.data;
            }
        } catch (err) {
            console.log(err);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (user: User) => {
        try {
            const response = await api.post('/signin', {user}, {withCredentials: true});
            if (response.data || response.data.accessToken) {
                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    }
);

export const otpVerification = createAsyncThunk(
    'user/otpVerification',
    async ({ user, otp }: { user: User; otp: string }) => {
        try {
            const response = await api.post('/verify-otp', { user, otp }, { withCredentials: true });

            if (response.data || response.data.success) {
                const {accessToken, refreshToken} = response.data;
                return {jwt_token: accessToken, refresh_token: refreshToken};
            }
        } catch (err) {
            console.error("OTP Verification Error:", err);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOutUser(state) {
            state.isAuthenticated = false;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = '';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.jwt_token = action.payload.accessToken;
                state.refresh_token = action.payload.refreshToken;
                state.username = action.payload.username;
                state.error = '';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(otpVerification.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(otpVerification.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                // @ts-ignore
                state.jwt_token = action.payload.jwt_token;
                // @ts-ignore
                state.refresh_token = action.payload.refresh_token;
                state.error = '';
            })
            .addCase(otpVerification.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });
    }
});

export const {logOutUser} = userSlice.actions;
export default userSlice.reducer;