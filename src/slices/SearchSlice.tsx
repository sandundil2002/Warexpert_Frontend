import {EmployeeModel} from "../models/employeeModel.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: EmployeeModel[] = [];

export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        addEmployee: (state, action: PayloadAction<EmployeeModel>) => {
            state.push(action.payload);
        },
        updateEmployee: (state, action: PayloadAction<EmployeeModel>) => {
            const index = state.findIndex((employee) => employee.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteEmployee: (state, action: PayloadAction<string>) => {
            return state.filter((employee) => employee.id !== action.payload);
        },
    },
});

export const {addEmployee, updateEmployee, deleteEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;

