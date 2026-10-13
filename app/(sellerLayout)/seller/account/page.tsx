"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import ListingsView from "@/components/seller/account/MyListing";
import {
    CheckCircle2,
    Eye,
    Heart,
    LayoutDashboard,
    LogOut,
    MessageCircle,
    Percent,
    Layers3,
    ClipboardList,
    LineChart,
    User,
} from "lucide-react";
import ListingPerformanceView from "@/components/seller/account/ListingPerformance";
import AccountDetailsView from "@/components/seller/account/AccountDetails";
import { useGetSellerAnalyticsQuery } from "@/redux/features/seller/analytics/analyticsApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { baseApi } from "@/redux/api/baseApi";

type AccountView =
    | "dashboard"
    | "listings"
    | "performance"
    | "account";

const NAV_ITEMS: {
    id: AccountView;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
}[] = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "listings", label: "My Listings", icon: ClipboardList },
        { id: "performance", label: "Listing Performance", icon: LineChart },
        { id: "account", label: "Account Details", icon: User },
    ];

function DashboardView() {
    const { data: analytics, isLoading, isError, refetch } =
        useGetSellerAnalyticsQuery();

    if (isLoading) {
        return (
            <section className="grid w-full min-w-0 gap-5 sm:grid-cols-2">
                {Array.from({ length: 6 }, (_, index) => (
                    <div
                        key={index}
                        className="flex min-h-22 animate-pulse items-center gap-4 rounded-xl bg-white px-5 shadow-sm"
                    >
                        <div className="h-11 w-11 rounded-lg bg-slate-100" />
                        <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-slate-100" />
                            <div className="h-6 w-12 rounded bg-slate-100" />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    if (isError || !analytics) {
        return (
            <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">
                    Unable to load dashboard analytics
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Please try again to load your latest account statistics.
                </p>
                <button
                    type="button"
                    onClick={() => void refetch()}
                    className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                    Try again
                </button>
            </section>
        );
    }

    const stats = [
        {
            label: "Total Listings",
            value: analytics.totalListings.toString(),
            icon: Layers3,
            iconClassName: "bg-blue-50 text-blue-500",
        },
        {
            label: "Active Listings",
            value: analytics.activeListings.toString(),
            icon: CheckCircle2,
            iconClassName: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Total Views",
            value: analytics.totalViews.toLocaleString(),
            icon: Eye,
            iconClassName: "bg-orange-50 text-orange-500",
        },
        {
            label: "Total Favourites",
            value: analytics.totalFavorites.toLocaleString(),
            icon: Heart,
            iconClassName: "bg-red-50 text-red-500",
        },
        {
            label: "Total Inquiries",
            value: analytics.totalInquiries.toLocaleString(),
            icon: MessageCircle,
            iconClassName: "bg-violet-50 text-violet-500",
        },
        {
            label: "Engagement Rate",
            value: `${(analytics.engagementRate * 100).toFixed(1)}%`,
            icon: Percent,
            iconClassName: "bg-cyan-50 text-cyan-500",
        },
    ];

    return (
        <section className="grid w-full min-w-0 gap-5 sm:grid-cols-2">
            {stats.map(({ label, value, icon: Icon, iconClassName }) => (
                <div
                    key={label}
                    className="flex min-h-22 items-center gap-4 rounded-xl bg-white px-5 shadow-sm"
                >
                    <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
                    >
                        <Icon className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="mt-1 text-xl font-bold">{value}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default function AccountPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [activeView, setActiveView] = useState<AccountView>("dashboard");

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Log out?",
            text: "Are you sure you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
        router.replace("/login");
        toast.success("Logged out successfully");
    };

    const renderView = () => {
        switch (activeView) {
            case "listings":
                return <ListingsView />;
            case "performance":
                return <ListingPerformanceView />;
            case "account":
                return <AccountDetailsView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="w-full flex-1 bg-[#f5f6f7] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <aside className="flex min-h-155 flex-col rounded-xl bg-white p-5 shadow-sm">
                        <h1 className="mb-8 text-base font-bold">My Account</h1>

                        <nav className="space-y-2" aria-label="Account navigation">
                            {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveView(id)}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === id
                                        ? "bg-[#e7f1ed] text-emerald-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </span>
                                    {badge !== undefined && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
                                            {badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-auto space-y-4 border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 text-sm font-semibold text-red-600 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {renderView()}
                </div>
            </main>
        </div>
    );
}