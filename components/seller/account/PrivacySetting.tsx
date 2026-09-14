"use client";

import Image from "next/image";
import { Phone, Mail, Search, ShieldCheck, ChevronRight, SearchX } from "lucide-react";

type SafetyTip = {
    id: string;
    text: string;
};

const safetyTips: SafetyTip[] = [
    { id: "tip-1", text: "Meet seller at a public place" },
    { id: "tip-2", text: "Check The item before you buy" },
    { id: "tip-3", text: "Pay only after collecting The item" },
];

const categories: string[] = [];

export default function PrivacySettingsView() {
    return (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* Main column */}
            <div className="min-w-0 space-y-5">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-emerald-500">
                            <Image
                                src="https://i.pravatar.cc/160?img=12"
                                alt="Store owner"
                                fill
                                sizes="112px"
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-slate-900">Store name</h1>

                            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
                                <span className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                        <Phone className="h-3.5 w-3.5" />
                                    </span>
                                    +880 1731049538
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                        <Mail className="h-3.5 w-3.5" />
                                    </span>
                                    ovierahaman1@gmail.com
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-sm font-bold text-slate-900">
                        All ads from Store 1
                    </h2>

                    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-white px-6 py-10 text-center shadow-sm">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-400">
                            <SearchX className="h-6 w-6" />
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-slate-800">
                            No results found
                        </h3>
                        <p className="mt-2 max-w-sm text-sm text-slate-400">
                            There are currently no active listings available for this
                            profile. Check back later.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Search</h2>
                    <div className="relative mt-3">
                        <input
                            type="text"
                            placeholder="Search here ..."
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-emerald-500"
                        />
                        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Categories</h2>
                    <div className="mt-3">
                        {categories.length === 0 ? (
                            <p className="flex items-center gap-1 text-sm text-slate-400">
                                <ChevronRight className="h-3.5 w-3.5" />
                                No categories
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li
                                        key={category}
                                        className="flex items-center gap-1 text-sm text-slate-600"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Safety Tips for Buyers
                    </h2>
                    <ul className="mt-3 space-y-3">
                        {safetyTips.map((tip) => (
                            <li
                                key={tip.id}
                                className="flex items-start gap-1 text-sm text-slate-500"
                            >
                                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                {tip.text}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </section>
    );
}