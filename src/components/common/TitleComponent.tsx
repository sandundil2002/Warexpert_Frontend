import React from "react";

interface TitleProps {
    title: string;
    addWarehouse?: () => void;
}

export const TitleComponent: React.FC<TitleProps> = ({ title, addWarehouse }) => {
    return (
        <>
            <div className="w-full bg-blue-500 p-6 rounded-lg flex items-center justify-between">
                <h1 className="text-white text-3xl font-bold tracking-tight">
                    {title}
                </h1>
                <div className="flex gap-3">
                    <button onClick={addWarehouse} className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                        Add Warehouse
                    </button>
                </div>
            </div>
        </>
    );
};