import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";

interface StockSummaryItem {
    warehouseId: string;
    category: string;
    _count: {
        id: number;
    } | null | undefined;
    _sum: {
        quantity: number;
    } | null | undefined;
}

interface MappedStockItem {
    warehouseId: string;
    category: string;
    totalItems: number;
    totalQuantity: number;
}

const StockSummaryChart = () => {
    const stockSummary = useSelector((state: RootState) => state.report.stockSummary);

    const mappedData: MappedStockItem[] = stockSummary.map((item: StockSummaryItem) => ({
        warehouseId: item.warehouseId,
        category: item.category,
        totalItems: item._count?.id || 0,
        totalQuantity: item._sum?.quantity || 0,
    }));

    const aggregatedData = mappedData.reduce((acc, item) => {
        const existingCategory = acc.find(c => c.category === item.category);

        if (existingCategory) {
            existingCategory.totalItems += item.totalItems;
            existingCategory.totalQuantity += item.totalQuantity;
        } else {
            acc.push({
                category: item.category,
                totalItems: item.totalItems,
                totalQuantity: item.totalQuantity
            });
        }

        return acc;
    }, [] as Array<{category: string, totalItems: number, totalQuantity: number}>);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={aggregatedData}>
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