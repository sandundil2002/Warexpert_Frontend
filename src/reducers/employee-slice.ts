import {Employee} from "../model/employee.ts";
import axios from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: Employee[] = [];

const api = axios.create({
    baseURL: "http://localhost:3000/staff",
});

export const getEmployees = createAsyncThunk<Employee[]>(
    "employee/getEmployees",
    async () => {
        try {
            const response = await api.get("/get");
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const addEmployee = createAsyncThunk<Employee, Employee>(
    "employee/addEmployee",
    async (employee) => {
        try {
            const response = await api.post("/post", employee);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const updateEmployee = createAsyncThunk<Employee, {id: string; employee:Employee}>(
    "employee/updateEmployee",
    async ({ id, employee}) => {
        try {
            const response = await api.patch(`/patch/${id}`, employee);
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    }
);

export const deleteEmployee = createAsyncThunk<string, string>(
    "employee/deleteEmployee",
    async (id) => {
        await api.delete(`/delete/${id}`);
        return id;
    }
);

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEmployees.pending, () => {
                console.log("Pending get employees");
            })
            .addCase(getEmployees.fulfilled, (state, action) => {
                action.payload.map((employee: Employee) => {
                    state.push(employee);
                })
            })
            .addCase(getEmployees.rejected, () => {
                console.log("Error fetching employee");
            })

        builder
            .addCase(addEmployee.pending, () => {
                console.log("Pending add employee");
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                console.log("Employee added");
                state.push(action.payload);
            })
            .addCase(addEmployee.rejected, () => {
                console.log("Rejected add employee");
            })

        builder
            .addCase(updateEmployee.pending, () => {
                console.log("Pending update employee");
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.findIndex((employee) => employee.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
            })
            .addCase(updateEmployee.rejected, () => {
                console.log("Rejected update employee");
            })

        builder
            .addCase(deleteEmployee.pending, () => {
                console.log("Pending delete employee");
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                return state.filter((employee) => employee.id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, () => {
                console.log("Rejected delete employee");
            })
    },
});

export default employeeSlice.reducer;

