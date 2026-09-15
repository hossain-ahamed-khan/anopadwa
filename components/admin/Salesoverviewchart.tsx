"use client";

import {
    Bar,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
    { day: "Mon", orders: 40, returns: 30, trend: 20 },
    { day: "Tue", orders: 60, returns: 90, trend: 40 },
    { day: "Wed", orders: 80, returns: 60, trend: 60 },
    { day: "Thu", orders: 120, returns: 100, trend: 90 },
    { day: "Fri", orders: 200, returns: 180, trend: 150 },
    { day: "Sat", orders: 380, returns: 420, trend: 350 },
    { day: "Sun", orders: 620, returns: 700, trend: 780 },
];

export default function SalesOverviewChart() {
    return (
        <div className="rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Sales Overview</h3>
                <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">
                    Last Week
                    <ChevronDown size={14} />
                </button>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} barGap={4}>
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                        />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1" }} />
                        <Bar dataKey="orders" fill="#6366F1" radius={[3, 3, 0, 0]} maxBarSize={12} />
                        <Bar dataKey="returns" fill="#FB7185" radius={[3, 3, 0, 0]} maxBarSize={12} />
                        <Line
                            type="monotone"
                            dataKey="trend"
                            stroke="#22D3EE"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#22D3EE" }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}