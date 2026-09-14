"use client";

import Image from "next/image";
import { Phone, Mail, MapPin, Star, Clock3, Tag } from "lucide-react";

type BusinessDetail = {
    label: string;
    value: string;
};

type ActiveListing = {
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

const businessDetails: BusinessDetail[] = [
    { label: "Business Type", value: "Electronics Store" },
    { label: "Customers Served", value: "10+" },
    { label: "Response Time", value: "Usually within 1 hour" },
];

const activeListings: ActiveListing[] = [
    {
        id: "listing-1",
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
        id: "listing-2",
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

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1 text-sm">
            <div className="flex text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                    <Star
                        key={index}
                        className="h-4 w-4"
                        fill={index < Math.round(rating) ? "currentColor" : "none"}
                    />
                ))}
            </div>
            <span className="font-semibold text-slate-700">({rating.toFixed(1)})</span>
        </div>
    );
}

export default function AccountDetailsView() {
    return (
        <section className="space-y-5">
            {/* Profile card */}
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

                        <div className="mt-3 border-t border-slate-100 pt-3">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
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

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                    <MapPin className="h-3.5 w-3.5" />
                                </span>
                                Ghana, New Road
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                                <StarRating rating={4.0} />
                                <span className="text-sm text-slate-400">· 245 Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">About TechZone Electronics</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    Welcome to TechZone Electronics. We provide high-quality smartphones,
                    laptops, accessories, and consumer electronics at competitive prices.
                    Our goal is to make quality technology accessible with reliable
                    customer service and trusted products.
                </p>
            </div>

            {/* Business details */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">Business Details</h2>
                <div className="mt-3 divide-y divide-slate-100">
                    {businessDetails.map((detail) => (
                        <div
                            key={detail.label}
                            className="flex items-center justify-between py-3 text-sm"
                        >
                            <span className="text-slate-400">{detail.label}</span>
                            <span className="font-medium text-slate-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active listings */}
            <div>
                <h2 className="mb-3 text-sm font-bold text-slate-900">
                    Active business listings
                </h2>

                <div className="rounded-xl bg-white shadow-sm">
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

                        {activeListings.map((listing) => (
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
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}