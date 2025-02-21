import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import {RootState} from "../../store/store.ts";

const LowStockTable = () => {
    const lowCapacityAlerts = useSelector((state: RootState) => state.report.lowCapacityAlerts);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Warehouse Name</TableCell>
                        <TableCell>Total Quantity</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Capacity Used (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lowCapacityAlerts.length > 0 ? (
                        lowCapacityAlerts.map((alert) => (
                            // @ts-ignore
                            <TableRow key={alert.warehouseId}>
                                {/*// @ts-ignore*/}
                                <TableCell>{alert.warehouseName}</TableCell>
                                {/*// @ts-ignore*/}
                                <TableCell>{alert.totalQuantity}</TableCell>
                                {/*// @ts-ignore*/}
                                <TableCell>{alert.capacity}</TableCell>
                                {/*// @ts-ignore*/}
                                <TableCell>{alert.capacityUsedPercentage.toFixed(2)}%</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                No low capacity alerts found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LowStockTable;