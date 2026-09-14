"use client";

import Image from "next/image";
import { Clock3, Tag } from "lucide-react";

type PerformanceListing = {
    id: string;
    thumbnail: string;
    title: string;
    isNew: boolean;
    postedAt: string;
    categories: string;
    views: number;
    favorites: number;
    inquiries: number;
    listingAge: string;
    promotion: string;
};

const performanceListings: PerformanceListing[] = [
    {
        id: "performance-1",
        thumbnail: "/image/product-image.png",
        title: "Baby Diapar",
        isNew: true,
        postedAt: "4 minutes ago",
        categories: "Babies & Kids, Baby Gear & Equipment",
        views: 88,
        favorites: 2,
        inquiries: 1,
        listingAge: "2 Days Ago",
        promotion: "2 Days left",
    },
    {
        id: "performance-2",
        thumbnail: "/image/product-image.png",
        title: "Baby Diapar",
        isNew: true,
        postedAt: "4 minutes ago",
        categories: "Babies & Kids, Baby Gear & Equipment",
        views: 88,
        favorites: 2,
        inquiries: 1,
        listingAge: "2 Days Ago",
        promotion: "2 Days left",
    },
];

export default function ListingPerformanceView() {
    return (
        <section className="rounded-xl bg-white shadow-sm">
            <div className="px-5">
                <div className="grid grid-cols-[80px_minmax(0,1fr)_110px_90px_90px_110px_110px] gap-4 border-b border-slate-100 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <span>Thumbnail</span>
                    <span>Title</span>
                    <span>Listing Views</span>
                    <span>Favorites</span>
                    <span>Inquiries</span>
                    <span>Listing Age</span>
                    <span>Promotion</span>
                </div>

                {performanceListings.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-400">
                        No performance data yet.
                    </p>
                ) : (
                    performanceListings.map((listing) => (
                        <div
                            key={listing.id}
                            className="grid grid-cols-[80px_minmax(0,1fr)_110px_90px_90px_110px_110px] items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
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
                            </div>

                            <p className="text-sm text-slate-600">{listing.views}</p>
                            <p className="text-sm text-slate-600">{listing.favorites}</p>
                            <p className="text-sm text-slate-600">{listing.inquiries}</p>
                            <p className="text-sm text-slate-600">{listing.listingAge}</p>
                            <p className="text-sm text-slate-600">{listing.promotion}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}