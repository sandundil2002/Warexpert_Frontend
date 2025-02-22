import axios from "axios";
import {refreshToken} from "../reducers/user-slice.ts";

let isRefreshing = false;
let failedQueue: any[] = [];

let store: any;

export const injectStore = (_store: any) => {
    store = _store;
};

export const getStore = () => {
    if (!store) {
        throw new Error("Store not injected. Call injectStore() first.");
    }
    return store;
};

const processQueue = (error: any = null) => {
    failedQueue.forEach((cb) => cb(error));
    failedQueue = [];
};

export const apiInstance = axios.create({
    baseURL: "http://localhost:3000",
});

apiInstance.interceptors.request.use(
    (config) => {
        const store = getStore();
        const token = store.getState().user.jwt_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push((err: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(apiInstance(originalRequest));
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const store = getStore();
                const refreshResponse = await store.dispatch(refreshToken(store.getState().user.refresh_token));
                const newAccessToken = refreshResponse.payload.accessToken;

                store.dispatch({
                    type: "user/updateTokens",
                    payload: {
                        jwt_token: newAccessToken,
                        refresh_token: refreshResponse.payload.refreshToken,
                    },
                });

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue();
                return apiInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                console.warn("Failed to refresh token. Redirecting to login...");
                window.location.href = "/signin";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        } else if (error.response?.status === 500 || error.code === 'ERR_NETWORK') {
            console.error('Server error or network error:', error);
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);