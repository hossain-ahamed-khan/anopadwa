"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
    { product: "17 Pro Mobile", units: 45 },
    { product: "Car", units: 195 },
    { product: "Toyota Car", units: 95 },
    { product: "Benz 14 Gen", units: 155 },
    { product: "Audi 18", units: 115 },
    { product: "18 Pro", units: 60 },
    { product: "Seden Car", units: 100 },
].reverse();

export default function TopProductsChart() {
    return (
        <div className="rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Top Products</h3>
                <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">
                    Last Months
                    <ChevronDown size={14} />
                </button>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 8, right: 16 }}
                        barCategoryGap="30%"
                    >
                        <CartesianGrid horizontal={false} stroke="#F3F4F6" />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                        />
                        <YAxis
                            type="category"
                            dataKey="product"
                            tickLine={false}
                            axisLine={false}
                            width={90}
                            tick={{ fontSize: 11, fill: "#6B7280" }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(99,102,241,0.06)" }}
                            contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1" }}
                        />
                        <Bar dataKey="units" fill="#818CF8" radius={[0, 4, 4, 0]} maxBarSize={16} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}