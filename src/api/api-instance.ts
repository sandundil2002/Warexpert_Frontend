import axios from "axios";

let store: any;

export const injectStore = (_store: any) => {
    store = _store;
};

export const apiInstance = axios.create({
    baseURL: "http://localhost:3000",
});

apiInstance.interceptors.request.use(
    (config) => {
        if (store) {
            const token = store.getState().user.jwt_token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized: Token expired or invalid.");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);