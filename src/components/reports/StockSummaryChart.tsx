import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import {RootState} from "../../store/store.ts";

const StockSummaryChart = () => {
    const stockSummary = useSelector((state: RootState) => state.report.stockSummary);

    const formattedData = stockSummary.map((item) => ({
        warehouseId: item.warehouseId,
        category: item.category,
        totalItems: item._count.id,
        totalQuantity: item._sum.quantity,
    }));

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={formattedData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalItems" fill="#8884d8" name="Total Items" />
                    <Bar dataKey="totalQuantity" fill="#82ca9d" name="Total Quantity" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockSummaryChart;