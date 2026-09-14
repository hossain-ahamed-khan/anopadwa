"use client";

import { useState } from "react";
import Image from "next/image";
import ListingsView from "@/components/seller/account/MyListing";
import {
    CheckCircle2,
    Clock3,
    Heart,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    TriangleAlert,
    Layers3,
    ClipboardList,
    LineChart,
    User,
    ShieldCheck,
    PlusCircle,
} from "lucide-react";
import ListingPerformanceView from "@/components/seller/account/ListingPerformance";
import FavouritesView from "@/components/seller/account/Favourites";
import MessagesPage from "@/components/seller/account/Chat";
import AccountDetailsView from "@/components/seller/account/AccountDetails";
import PrivacySettingsView from "@/components/seller/account/PrivacySetting";

const stats = [
    {
        label: "Total Listings",
        value: "0",
        icon: Layers3,
        iconClassName: "bg-blue-50 text-blue-500",
    },
    {
        label: "Published Listings",
        value: "0",
        icon: CheckCircle2,
        iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
        label: "Pending Listings",
        value: "0",
        icon: Clock3,
        iconClassName: "bg-orange-50 text-orange-500",
    },
    {
        label: "Expired Listings",
        value: "0",
        icon: TriangleAlert,
        iconClassName: "bg-red-50 text-red-500",
    },
];

const favourites = Array.from({ length: 3 }, (_, index) => ({
    id: `favourite-${index}`,
    title: "T-shirts with multiple colors, for men and lady",
    details: "Size: medium, Color: blue, Material: Plastic",
    seller: "Artel Market",
    price: "₵78.99",
}));

type AccountView =
    | "dashboard"
    | "listings"
    | "performance"
    | "favourites"
    | "chat"
    | "account"
    | "privacy";

const NAV_ITEMS: {
    id: AccountView;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
}[] = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "listings", label: "My Listings", icon: ClipboardList },
        { id: "performance", label: "Listing Performance", icon: LineChart },
        { id: "favourites", label: "Favourites", icon: Heart },
        { id: "chat", label: "Chat", icon: MessageSquare, badge: 0 },
        { id: "account", label: "Account Details", icon: User },
        { id: "privacy", label: "Privacy Settings", icon: ShieldCheck },
    ];

function EmptyStateView({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
        </section>
    );
}

function DashboardView() {
    return (
        <section className="min-w-0">
            <div className="flex items-center gap-4 rounded-xl bg-white px-5 py-5 shadow-sm sm:px-6">
                <Image
                    src="https://i.pravatar.cc/96?img=12"
                    alt="Ovie Rahaman"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                />
                <div>
                    <h2 className="text-base font-bold">Ovie Rahaman</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        <span className="font-semibold text-slate-700">Email:</span>{" "}
                        ovierahaman1@gmail.com
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            </div>
        </section>
    );
}

export default function AccountPage() {
    const [activeView, setActiveView] = useState<AccountView>("dashboard");

    const renderView = () => {
        switch (activeView) {
            case "favourites":
                return <FavouritesView />;
            case "chat":
                return <MessagesPage />;
            case "listings":
                return <ListingsView />;
            case "performance":
                return <ListingPerformanceView />;
            case "account":
                return <AccountDetailsView />;
            case "privacy":
                return <PrivacySettingsView />;
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
                                className="flex items-center gap-3 px-3 text-sm font-semibold text-red-600 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>

                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 cursor-pointer"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add Listing
                            </button>
                        </div>
                    </aside>

                    {renderView()}
                </div>
            </main>
        </div>
    );
}