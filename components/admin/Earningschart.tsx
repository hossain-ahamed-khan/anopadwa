"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";

interface EarningsChartProps {
    data: Array<{ month: string; revenue: number }>;
    timeframe: string;
}

export default function EarningsChart({ data, timeframe }: EarningsChartProps) {
    return (
        <div className="rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Earnings</h3>
                <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">
                    {timeframe.replaceAll("_", " ")}
                    <ChevronDown size={14} />
                </button>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap="20%">
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            interval={1}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                        />
                        <YAxis
                            tickFormatter={(v) => `${v / 1000}k`}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(245,166,35,0.08)" }}
                            contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1" }}
                        />
                        <Bar dataKey="revenue" fill="#F5A623" radius={[4, 4, 0, 0]} maxBarSize={14} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Monthly Revenue
            </div>
        </div>
    );
}