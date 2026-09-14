"use client";

import { useState } from "react";
import Image from "next/image";
import {
    CheckCircle2,
    Clock3,
    Heart,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    TriangleAlert,
    Layers3,
} from "lucide-react";
import productImage from "@/public/image/product-image.png";
import MessagesPage from "@/components/buyer/chat/Message";

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

function FavouritesView() {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const allSelected = selectedItems.length === favourites.length;

    const toggleItem = (id: string) => {
        setSelectedItems((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    };

    const toggleAll = () => {
        setSelectedItems(allSelected ? [] : favourites.map((item) => item.id));
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:px-5">
            <div className="flex min-h-13 items-center justify-between border-b border-slate-200 gap-4">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 accent-emerald-600"
                        aria-label="Select all favourites"
                    />
                    Select All ({favourites.length} Items)
                </label>
                <button
                    type="button"
                    onClick={() => setSelectedItems([])}
                    className="rounded-md bg-red-50 px-5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                    Delete
                </button>
            </div>

            <div>
                {favourites.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-b-0 sm:gap-5"
                    >
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="h-4 w-4 shrink-0 accent-emerald-600"
                            aria-label={`Select ${item.title}`}
                        />
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                            <Image
                                src={productImage}
                                alt={item.title}
                                fill
                                sizes="80px"
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="min-w-0 flex-1 text-sm">
                            <h2 className="truncate font-medium text-slate-800">{item.title}</h2>
                            <p className="mt-1 truncate text-slate-400">{item.details}</p>
                            <p className="mt-1 text-slate-400">Seller: {item.seller}</p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-slate-800">{item.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function AccountPage() {
    const [activeView, setActiveView] = useState<"dashboard" | "favourites" | "chat">("dashboard");

    return (
        <div className="flex min-h-screen flex-col">
            <main className="w-full flex-1 bg-[#f5f6f7] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <aside className="flex min-h-155 flex-col rounded-xl bg-white p-5 shadow-sm">
                        <h1 className="mb-8 text-base font-bold">My Account</h1>

                        <nav className="space-y-2" aria-label="Account navigation">
                            <button
                                type="button"
                                onClick={() => setActiveView("dashboard")}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === "dashboard"
                                    ? "bg-[#e7f1ed] text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveView("favourites")}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === "favourites"
                                    ? "bg-[#e7f1ed] text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <Heart className="h-4 w-4" />
                                Favourites
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveView("chat")}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === "chat"
                                    ? "bg-[#e7f1ed] text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <MessageSquare className="h-4 w-4" />
                                    Chat
                                </span>
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
                                    0
                                </span>
                            </button>
                        </nav>

                        <button
                            type="button"
                            className="mt-auto flex items-center gap-3 border-t border-slate-100 px-3 pt-6 text-sm font-semibold text-red-600 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </aside>

                    {activeView === "favourites" ? <FavouritesView /> : activeView === "chat" ? <MessagesPage /> : <section className="min-w-0">
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
                                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs text-slate-500">{label}</p>
                                        <p className="mt-1 text-xl font-bold">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>}
                </div>
            </main>
        </div>
    );
}