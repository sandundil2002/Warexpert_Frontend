import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {useEffect} from "react";
import {fetchLowCapacityAlerts, fetchStockSummary} from "../reducers/report-slice.ts";
import StockSummaryChart from "../components/reports/StockSummaryChart.tsx";
import LowStockTable from "../components/reports/LowStockTable.tsx";

export const ReportPage = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.report);

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchStockSummary());
        // @ts-ignore
        dispatch(fetchLowCapacityAlerts());
    }, [dispatch]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div style={{padding: "20px"}}>
            <h1>Stock Summary</h1>
            <StockSummaryChart/>

            <h1 style={{marginTop: "40px", textAlign: "center"}}>Low Stock Alerts</h1>
            <LowStockTable/>
        </div>
    );
};