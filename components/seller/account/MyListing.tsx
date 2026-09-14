"use client";

import { useState } from "react";
import Image from "next/image";
import {
    ChevronDown,
    Search,
    Clock3,
    Tag,
    BarChart3,
    MoreHorizontal,
} from "lucide-react";

type ListingStatus = "Pending" | "Approved" | "Expired";

type Listing = {
    id: string;
    thumbnail: string;
    title: string;
    isNew: boolean;
    postedAt: string;
    categories: string;
    price: string;
    expiresOn: string;
    status: ListingStatus;
};

const STATUS_STYLES: Record<ListingStatus, string> = {
    Pending: "bg-orange-50 text-orange-500",
    Approved: "bg-emerald-50 text-emerald-600",
    Expired: "bg-red-50 text-red-500",
};

const listings: Listing[] = [
    {
        id: "listing-1",
        thumbnail: "/image/product-image.png",
        title: "Baby Diapar",
        isNew: true,
        postedAt: "4 minutes ago",
        categories: "Babies & Kids, Baby Gear & Equipment",
        price: "₵55",
        expiresOn: "-",
        status: "Pending",
    },
    {
        id: "listing-2",
        thumbnail: "/image/product-image.png",
        title: "Baby Diapar",
        isNew: true,
        postedAt: "4 minutes ago",
        categories: "Babies & Kids, Baby Gear & Equipment",
        price: "₵55",
        expiresOn: "-",
        status: "Approved",
    },
    {
        id: "listing-3",
        thumbnail: "/image/product-image.png",
        title: "Baby Diapar",
        isNew: true,
        postedAt: "4 minutes ago",
        categories: "Babies & Kids, Baby Gear & Equipment",
        price: "₵55",
        expiresOn: "-",
        status: "Expired",
    },
];

function DirectoryFilter() {
    return (
        <div className="relative">
            <select
                defaultValue=""
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-emerald-500 sm:w-48"
            >
                <option value="" disabled>
                    -- Select Directory --
                </option>
                <option value="babies-kids">Babies & Kids</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

function StatusFilter() {
    return (
        <div className="relative">
            <select
                defaultValue=""
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-emerald-500 sm:w-44"
            >
                <option value="" disabled>
                    -- Select Status --
                </option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="expired">Expired</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

export default function ListingsView() {
    const [query, setQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <section className="rounded-xl bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <DirectoryFilter />
                <StatusFilter />
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by title"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="px-5">
                <div className="grid grid-cols-[80px_minmax(0,1fr)_90px_110px_100px_50px] gap-4 border-b border-slate-100 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <span>Thumbnail</span>
                    <span>Title</span>
                    <span>Price</span>
                    <span>Expires On</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {filteredListings.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-400">
                        No listings match your search.
                    </p>
                ) : (
                    filteredListings.map((listing) => (
                        <div
                            key={listing.id}
                            className="grid grid-cols-[80px_minmax(0,1fr)_90px_110px_100px_50px] items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
                        >
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-slate-200 bg-white">
                                <Image
                                    src={listing.thumbnail}
                                    alt={listing.title}
                                    fill
                                    sizes="64px"
                                    className="object-contain p-1"
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="truncate text-sm font-semibold text-slate-800">
                                        {listing.title}
                                    </h3>
                                    {listing.isNew && (
                                        <span className="shrink-0 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                            NEW
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {listing.postedAt}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span className="truncate">{listing.categories}</span>
                                </div>
                                <button
                                    type="button"
                                    className="mt-1.5 flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    aria-label={`View performance for ${listing.title}`}
                                >
                                    <BarChart3 className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <p className="text-sm font-semibold text-slate-800">
                                {listing.price}
                            </p>

                            <p className="text-sm text-slate-400">{listing.expiresOn}</p>

                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[listing.status]}`}
                            >
                                {listing.status}
                            </span>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenMenuId((current) =>
                                            current === listing.id ? null : listing.id,
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50"
                                    aria-label={`Actions for ${listing.title}`}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>

                                {openMenuId === listing.id && (
                                    <div className="absolute right-0 top-9 z-10 w-32 rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-md">
                                        <button
                                            type="button"
                                            className="block w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-slate-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}