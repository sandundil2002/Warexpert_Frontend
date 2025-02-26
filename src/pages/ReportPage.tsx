import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store.ts";
import {useEffect} from "react";
import {fetchLowCapacityAlerts, fetchStockSummary} from "../reducers/report-slice.ts";
import StockSummaryChart from "../components/reports/StockSummaryChart.tsx";
import LowStockTable from "../components/reports/LowStockTable.tsx";
import {fetchEquipment, fetchStaff, fetchTransportation} from "../reducers/dashboard-slice.ts";
import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts";
import {Grid} from "@mui/material";
import {Navigate} from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB"];

export const ReportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const { loading, error } = useSelector((state: RootState) => state.report);
    const {equipment, transportation, staff,} = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchStockSummary());
        dispatch(fetchLowCapacityAlerts());
        dispatch(fetchTransportation());
        dispatch(fetchEquipment());
        dispatch(fetchStaff());
    }, [dispatch]);

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const equipmentStatusCount = equipment.reduce((acc, item) => {
        const status = item.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const equipmentData = Object.entries(equipmentStatusCount).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    const staffRoleCount = staff.reduce((acc, member) => {
        const role = member.role || "Unknown";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const staffData = Object.entries(staffRoleCount).map(([role, count]) => ({
        name: role,
        value: count,
    }));

    const transportStatusCount = transportation.reduce((acc, vehicle) => {
        const status = vehicle.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const transportData = Object.entries(transportStatusCount).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    return (
        <div style={{padding: "20px"}}>
            <h1>Stock Summary</h1>
            <StockSummaryChart/>

            <h1 style={{marginTop: "40px", textAlign: "center"}}>Low Stock Alerts</h1>
            <LowStockTable/>

            <div className="mt-10 text-center w-full flex flex-wrap justify-evenly">
                <Grid item xs={12} md={6}>
                    <h3 className="text-lg font-medium mb-2">Equipment Status</h3>
                    <PieChart className="border rounded" width={350} height={300}>
                        <Pie
                            data={equipmentData}
                            cx={175}
                            cy={150}
                            label
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {equipmentData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Grid>

                <Grid item xs={12} md={6}>
                    <h3 className="text-lg font-medium mb-2">Transportation Status</h3>
                    <PieChart className="border rounded" width={350} height={300}>
                        <Pie
                            data={transportData}
                            cx={175}
                            cy={150}
                            label
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {transportData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Grid>

                <Grid item xs={12} md={6}>
                    <h3 className="text-lg font-medium mb-2">Staff Role Distribution</h3>
                    <PieChart className="border rounded" width={350} height={300}>
                        <Pie
                            data={staffData}
                            cx={175}
                            cy={150}
                            label
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {staffData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Grid>
            </div>
        </div>
    );
};