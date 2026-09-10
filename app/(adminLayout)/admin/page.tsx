"use client";

import { useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface StatCardData {
    icon: React.ReactNode;
    value: string;
    label: string;
}

interface OverviewSectionProps {
    title: string;
    stats: StatCardData[];
}

interface EarningsPoint {
    month: string;
    revenue: number;
}

/* ------------------------------------------------------------------ */
/* Icons (inline, no external image assets required)                  */
/* ------------------------------------------------------------------ */

function UsersIcon() {
    return (
        <div className="flex h-9 w-9 items-center justify-center">
            <span className="text-xl">👫</span>
        </div>
    );
}

function NewBadgeIcon() {
    return (
        <div className="relative flex h-9 w-9 items-center justify-center">
            <svg viewBox="0 0 40 40" className="h-9 w-9 fill-amber-400">
                <path d="M20 0l2.6 5.8 6-2.9-.6 6.6 6.6-.6-2.9 6L38 17.4 32.7 20 38 22.6l-5.8 2.6 2.9 6-6.6-.6.6 6.6-6-2.9L20 40l-2.6-5.8-6 2.9.6-6.6-6.6.6 2.9-6L2 22.6 7.3 20 2 17.4l5.8-2.6-2.9-6 6.6.6-.6-6.6 6 2.9L20 0z" />
            </svg>
            <span className="absolute text-[7px] font-extrabold tracking-tight text-neutral-900">
                NEW
            </span>
        </div>
    );
}

function ActiveCheckIcon() {
    return (
        <div className="flex h-9 w-9 items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-emerald-500">
                <path d="M9.5 16.2L5.3 12l-1.4 1.4L9.5 19 20 8.5 18.6 7.1z" />
            </svg>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

function GreetingHeader({ name }: { name: string }) {
    return (
        <div className="rounded-2xl bg-white p-6">
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
                Hi, <span className="text-base">🙂</span> Good Morning
            </p>
            <h1 className="mt-1 text-xl font-bold text-neutral-900">{name}</h1>
        </div>
    );
}

function StatCard({ icon, value, label }: StatCardData) {
    return (
        <div className="rounded-xl bg-neutral-50 p-5">
            {icon}
            <p className="mt-4 text-xl font-bold text-neutral-900">{value}</p>
            <p className="mt-1 text-sm text-neutral-500">{label}</p>
        </div>
    );
}

function OverviewSection({ title, stats }: OverviewSectionProps) {
    return (
        <div className="rounded-2xl bg-white p-6">
            <h2 className="text-base font-bold text-neutral-900">{title}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>
        </div>
    );
}

function EarningsChart({ data }: { data: EarningsPoint[] }) {
    const [range, setRange] = useState("Last 6 Months");

    return (
        <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-neutral-900">Earnings</h2>
                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                >
                    {range}
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap="30%">
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#60A5FA", fontSize: 11, fontWeight: 600 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
                            tick={{ fill: "#F59E0B", fontSize: 11, fontWeight: 600 }}
                            domain={[0, 25000]}
                            ticks={[0, 5000, 10000, 15000, 20000, 25000]}
                        />
                        <Tooltip
                            formatter={(value) => [
                                `${Number(value ?? 0).toLocaleString()}`,
                                "Earnings",
                            ]}
                        />
                        <Bar dataKey="revenue" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Monthly Revenue
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sample data — replace with your RTK Query hooks                    */
/* ------------------------------------------------------------------ */

const userStats: StatCardData[] = [
    { icon: <UsersIcon />, value: "4,55,666", label: "Total Users" },
    { icon: <NewBadgeIcon />, value: "1320", label: "Today New User's" },
    { icon: <ActiveCheckIcon />, value: "1320", label: "Active User" },
];

const sellerStats: StatCardData[] = [
    { icon: <UsersIcon />, value: "4,55,666", label: "Total Sellers" },
    { icon: <NewBadgeIcon />, value: "1320", label: "Today New Sellers" },
    { icon: <ActiveCheckIcon />, value: "1320", label: "Active Sellers" },
];

const buyerStats: StatCardData[] = [
    { icon: <UsersIcon />, value: "4,55,666", label: "Total Buyers" },
    { icon: <NewBadgeIcon />, value: "1320", label: "Today New Buyers" },
    { icon: <ActiveCheckIcon />, value: "1320", label: "Active Buyers" },
];

const earningsData: EarningsPoint[] = [
    { month: "January", revenue: 4200 },
    { month: "", revenue: 6800 },
    { month: "February", revenue: 5100 },
    { month: "", revenue: 7600 },
    { month: "March", revenue: 5900 },
    { month: "", revenue: 12200 },
    { month: "", revenue: 16500 },
    { month: "April", revenue: 13800 },
    { month: "", revenue: 13300 },
    { month: "", revenue: 8600 },
    { month: "May", revenue: 15600 },
    { month: "", revenue: 10700 },
    { month: "", revenue: 6100 },
    { month: "June", revenue: 4300 },
    { month: "", revenue: 4900 },
    { month: "", revenue: 5100 },
    { month: "July", revenue: 5300 },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DashboardOverview() {
    return (
        <div className="min-h-screen bg-orange-50/40 p-6">
            <div className="mx-auto max-w-6xl space-y-4">
                <GreetingHeader name="Moni Roy" />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <OverviewSection title="User's Overview" stats={userStats} />
                    <EarningsChart data={earningsData} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <OverviewSection title="Seller's Overview" stats={sellerStats} />
                    <OverviewSection title="Buyer's Overview" stats={buyerStats} />
                </div>
            </div>
        </div>
    );
}