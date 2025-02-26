import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Container, Grid, CircularProgress, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip} from "@mui/material";
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,} from "recharts";
import {AppDispatch, RootState} from "../store/store.ts";
import {fetchCustomers, fetchEquipment, fetchInventory, fetchStaff, fetchTransportation, fetchWarehouses} from "../reducers/dashboard-slice.ts";
import {Navigate} from "react-router-dom";

export const MainPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const colors = {primary: "#2563eb", secondary: "#10b981", warning: "#f59e0b", error: "#ef4444", info: "#0ea5e9", background: "#f9fafb", lightBlue: "#93c5fd", darkBlue: "#1e40af", accent: "#8b5cf6", chartColors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6"]};
    const {inventory, warehouses, equipment, staff, transportation, loading, error,} = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchEquipment());
        dispatch(fetchWarehouses());
        dispatch(fetchStaff());
        dispatch(fetchTransportation());
        dispatch(fetchCustomers());
    }, [dispatch]);

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    const warehouseData = warehouses.map((warehouse) => {
        const warehouseId = warehouse.id;
        const warehouseCapacity = Number(warehouse.capacity) || 0;

        const usedCapacity = inventory
            .filter((item) => item.warehouseId === warehouseId)
            .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

        return {
            name: warehouse.name || "Unknown",
            usedCapacity,
            remainingCapacity: Math.max(0, warehouseCapacity - usedCapacity),
        };
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metrics = useMemo(() => {
        const totalCapacity = warehouses.reduce(
            (sum, warehouse) => sum + (Number(warehouse.capacity) || 0),
            0
        );

        const totalUsedCapacity = warehouseData.reduce(
            (sum, data) => sum + data.usedCapacity,
            0
        );

        const capacityUtilizationPct = totalCapacity > 0
            ? Math.round((totalUsedCapacity / totalCapacity) * 100)
            : 0;

        const nearFullWarehouses = warehouseData.filter(data => {
            const total = data.usedCapacity + data.remainingCapacity;
            return total > 0 && (data.usedCapacity / total) > 0.9;
        }).length;

        const equipmentStatusCount = equipment.reduce((acc, item) => {
            const status = item.status || "Unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const maintenanceNeeded = equipmentStatusCount["Needs Maintenance"] || 0;
        const totalEquipment = equipment.length;
        const maintenancePct = totalEquipment > 0
            ? Math.round((maintenanceNeeded / totalEquipment) * 100)
            : 0;

        return {
            totalCapacity,
            totalUsedCapacity,
            capacityUtilizationPct,
            availableCapacity: totalCapacity - totalUsedCapacity,
            warehouseCount: warehouses.length,
            nearFullWarehouses,
            maintenancePct,
            transportationAvailable: transportation.filter(t => t.status === "Available").length,
            totalStaff: staff.length,
        };
    }, [warehouses, warehouseData, equipment, transportation, staff]);

    const utilizationPieData = [
        { name: "Used Capacity", value: metrics.totalUsedCapacity },
        { name: "Available Capacity", value: metrics.availableCapacity }
    ];

    const PIE_COLORS = [colors.primary, colors.secondary];

    const getStatusChipProps = (utilization: number) => {
        if (utilization > 90) {
            return {
                label: "Near Full",
                color: "error" as const,
                bgColor: colors.error
            };
        } else if (utilization > 75) {
            return {
                label: "High Usage",
                color: "warning" as const,
                bgColor: colors.warning
            };
        } else if (utilization < 30) {
            return {
                label: "Underutilized",
                color: "info" as const,
                bgColor: colors.info
            };
        } else {
            return {
                label: "Optimal",
                color: "success" as const,
                bgColor: colors.secondary
            };
        }
    };

    if (loading) return <CircularProgress style={{ color: colors.primary }} />;
    if (error) return <div style={{ color: colors.error }}>{error}</div>;

    return (
        <Box>
            <Container>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: `4px solid ${colors.primary}`,
                                borderRadius: '4px',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }}>
                            <Box sx={{
                                fontSize: '0.875rem',
                                opacity: 0.8
                            }}>
                                Total Capacity
                            </Box>
                            <Box sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                my: 1,
                                color: colors.primary
                            }}>
                                {metrics.totalCapacity.toLocaleString()} units
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: `4px solid ${colors.secondary}`,
                                borderRadius: '4px',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }}>
                            <Box sx={{
                                fontSize: '0.875rem',
                                opacity: 0.8
                            }}>
                                Capacity Utilization
                            </Box>
                            <Box sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                my: 1,
                                color: metrics.capacityUtilizationPct > 90 ? colors.error :
                                    metrics.capacityUtilizationPct > 75 ? colors.warning : colors.secondary
                            }}>
                                {metrics.capacityUtilizationPct}%
                            </Box>
                            <Box sx={{ fontSize: '0.75rem', color: metrics.nearFullWarehouses > 0 ? colors.error : 'inherit' }}>
                                {metrics.nearFullWarehouses} warehouses near full capacity
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: `4px solid ${colors.warning}`,
                                borderRadius: '4px',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }}>
                            <Box sx={{
                                fontSize: '0.875rem',
                                opacity: 0.8
                            }}>
                                Equipment Maintenance
                            </Box>
                            <Box sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                my: 1,
                                color: metrics.maintenancePct > 25 ? colors.error :
                                    metrics.maintenancePct > 15 ? colors.warning : colors.secondary
                            }}>
                                {metrics.maintenancePct}%
                            </Box>
                            <Box sx={{ fontSize: '0.75rem' }}>
                                requires maintenance
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: `4px solid ${colors.accent}`,
                                borderRadius: '4px',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }}>
                            <Box sx={{
                                fontSize: '0.875rem',
                                opacity: 0.8
                            }}>
                                Resources
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primary }}>{metrics.warehouseCount}</Box>
                                    <Box sx={{ fontSize: '0.75rem' }}>Warehouses</Box>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.secondary }}>{metrics.totalStaff}</Box>
                                    <Box sx={{ fontSize: '0.75rem' }}>Staff</Box>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.info }}>{metrics.transportationAvailable}</Box>
                                    <Box sx={{ fontSize: '0.75rem' }}>Vehicles</Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={2} sx={{
                            p: 2,
                            height: '100%',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            borderRadius: '4px'
                        }}>
                            <Box component="h3" sx={{
                                fontSize: '1.25rem',
                                fontWeight: 'medium',
                                mb: 2,
                                mt: 0,
                            }}>
                                Warehouse Capacity Utilization
                            </Box>
                            <Box sx={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <BarChart data={warehouseData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => {
                                                return [`${value} units`, name === "usedCapacity"
                                                    ? "Used Capacity"
                                                    : "Remaining Capacity"];
                                            }}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: `1px solid ${colors.primary}`,
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <Bar dataKey="usedCapacity" stackId="a" name="Used Capacity" fill={colors.primary} />
                                        <Bar dataKey="remainingCapacity" stackId="a" name="Remaining Capacity" fill={colors.lightBlue} />
                                        <Legend />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{
                            p: 2,
                            height: '100%',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            borderRadius: '4px'
                        }}>
                            <Box component="h3" sx={{
                                fontSize: '1.25rem',
                                fontWeight: 'medium',
                                mb: 2,
                                mt: 0,
                            }}>
                                Overall Capacity Utilization
                            </Box>
                            <Box sx={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={utilizationPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={130}
                                            dataKey="value"
                                        >
                                            {utilizationPieData.map((_entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `${value} units`}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: `1px solid ${colors.primary}`,
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{
                            p: 2,
                            mb: 3,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            borderRadius: '4px'
                        }}>
                            <Box component="h3" sx={{
                                fontSize: '1.25rem',
                                fontWeight: 'medium',
                                mb: 2,
                                mt: 0,
                            }}>
                                Warehouse Efficiency
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{
                                            backgroundColor: colors.primary,
                                        }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Warehouse</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Total Capacity</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Used</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Available</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Utilization</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {warehouseData.map((warehouse, index) => {
                                            const total = warehouse.usedCapacity + warehouse.remainingCapacity;
                                            const utilization = total > 0
                                                ? (warehouse.usedCapacity / total) * 100
                                                : 0;

                                            const chipProps = getStatusChipProps(utilization);

                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                >
                                                    <TableCell sx={{ fontWeight: 'medium' }}>{warehouse.name}</TableCell>
                                                    <TableCell align="right">
                                                        {(warehouse.usedCapacity + warehouse.remainingCapacity).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell align="right">{warehouse.usedCapacity.toLocaleString()}</TableCell>
                                                    <TableCell align="right">{warehouse.remainingCapacity.toLocaleString()}</TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{
                                                            color: utilization > 90 ? colors.error :
                                                                utilization > 75 ? colors.warning :
                                                                    utilization < 30 ? colors.info : colors.secondary,
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {utilization.toFixed(1)}%
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            size="small"
                                                            label={chipProps.label}
                                                            color={chipProps.color}
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};