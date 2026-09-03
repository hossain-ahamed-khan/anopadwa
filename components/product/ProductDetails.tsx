"use client";

import { useState } from "react";
import { ChevronRight, Phone, MessageCircle, Flag, Clock, MapPin, Plus, Minus, ArrowRight, Star } from "lucide-react";

// ---------- Types ----------

interface OverviewItem {
    label: string;
    value: string;
}

interface RelatedProduct {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    image: string;
}

interface Seller {
    name: string;
    initial: string;
    isOnline: boolean;
    location: string;
    phone: string;
}

interface ProductDetail {
    breadcrumb: string[];
    title: string;
    images: string[];
    postedAt: string;
    location: string;
    price: number;
    description: string;
    overview: OverviewItem[];
    seller: Seller;
}

// ---------- Mock data ----------

const PRODUCT: ProductDetail = {
    breadcrumb: ["Home", "TWS", "Ear Buds"],
    title: "Dell Latitude Laptop Bundle (6 Units)",
    images: [
        "/product-main.png",
        "/product-thumb-1.png",
        "/product-thumb-2.png",
        "/product-thumb-3.png",
        "/product-thumb-4.png",
        "/product-thumb-5.png",
    ],
    postedAt: "August 28, 2025 10:01 am",
    location: "Accra Metropolitan, Greater Accra",
    price: 10000,
    description:
        "You are looking at a lot of 6 Dell Latitude laptops, read description and see pictures for detail information, some laptops need IT technician hands on, selling AS IS",
    overview: [
        { label: "Brand", value: "Dell" },
        { label: "Condition", value: "Used (As Is)" },
        { label: "Quantity", value: "6 Units" },
    ],
    seller: {
        name: "Anopadwa",
        initial: "A",
        isOnline: false,
        location: "Atwima Kwanwoma, Ashanti",
        phone: "0270000XXX",
    },
};

const RELATED_PRODUCTS: RelatedProduct[] = Array.from({ length: 5 }, (_, i) => ({
    id: `kvidio-512-${i}`,
    name: "Kvidio Headphone 512",
    location: "Atwima Kwanwoma, Ashanti",
    rating: 4,
    reviewCount: 0,
    price: 125000,
    image: "/headphone-placeholder.png",
}));

// ---------- Small building blocks ----------

function Breadcrumb({ items }: { items: string[] }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={item} className="flex items-center gap-1.5">
                        <span className={isLast ? "font-medium text-indigo-600" : "hover:text-gray-700 cursor-pointer"}>
                            {item}
                        </span>
                        {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                    </span>
                );
            })}
        </nav>
    );
}

function RatingStars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < count ? "fill-green-600 text-green-600" : "text-gray-300"}`}
                    />
                ))}
            </div>
            <span className="text-xs font-medium text-green-700">({count}.</span>
            <span className="text-xs text-gray-500">0)</span>
        </div>
    );
}

function ImageGallery({ images }: { images: string[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={images[activeIndex]}
                    alt="Product"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>

            <div className="mt-3 grid grid-cols-6 gap-2">
                {images.map((src, i) => (
                    <button
                        key={src + i}
                        onClick={() => setActiveIndex(i)}
                        className={`aspect-square overflow-hidden rounded-md border bg-white ${i === activeIndex ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"
                            }`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={`Thumbnail ${i + 1}`}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function PriceTag({ price }: { price: number }) {
    return (
        <div className="relative inline-flex items-center bg-green-700 py-2 pl-4 pr-6 text-lg font-bold text-white">
            ₵{price.toLocaleString()}
            <span className="absolute -right-[9px] top-0 h-0 w-0 border-y-[18px] border-l-[10px] border-y-transparent border-l-green-700" />
        </div>
    );
}

function OverviewCard({ items }: { items: OverviewItem[] }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 inline-block border-b-2 border-gray-900 pb-2 text-sm font-semibold text-gray-900">
                Overview
            </h3>
            <dl className="space-y-2.5">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                        <dt className="text-gray-500">{item.label}</dt>
                        <dd className="font-semibold text-gray-900">{item.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

function SellerCard({ seller }: { seller: Seller }) {
    const [phoneRevealed, setPhoneRevealed] = useState(false);

    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <h3 className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">
                Seller Information
            </h3>

            <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                        {seller.initial}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{seller.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className={`h-1.5 w-1.5 rounded-full ${seller.isOnline ? "bg-green-500" : "bg-red-500"}`} />
                            {seller.isOnline ? "Online Now" : "Offline Now"}
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {seller.location}
                </div>

                <button
                    onClick={() => setPhoneRevealed(true)}
                    className="mt-4 flex w-full flex-col items-center gap-0.5 rounded-md bg-gray-50 py-3 text-sm"
                >
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                        <Phone className="h-4 w-4 text-green-600" />
                        {phoneRevealed ? seller.phone.replace("XXX", "123") : seller.phone}
                    </span>
                    {!phoneRevealed && <span className="text-xs text-gray-500">Click to reveal phone number</span>}
                </button>

                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                </button>
            </div>

            <button className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 py-3 text-sm font-medium text-green-700 hover:bg-gray-50">
                <Flag className="h-3.5 w-3.5" />
                Report this listing
            </button>
        </div>
    );
}

function LocationMap({ label }: { label: string }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <h3 className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">Location</h3>

            <div className="relative h-72 overflow-hidden bg-[#e8e6df]">
                {/* Static map placeholder — swap for react-leaflet / Google Maps in production */}
                <svg className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none">
                    <defs>
                        <pattern id="roads" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M0 30 H60 M30 0 V60" stroke="#d1cfc6" strokeWidth="2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#roads)" />
                </svg>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                    <div className="mb-1 whitespace-nowrap rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                        {label}
                    </div>
                    <MapPin className="mx-auto h-7 w-7 fill-blue-500 text-blue-600" strokeWidth={1.5} />
                </div>

                <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
                    <button className="flex h-7 w-7 items-center justify-center border-b border-gray-200 hover:bg-gray-50">
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center hover:bg-gray-50">
                        <Minus className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="absolute bottom-1 right-2 text-[10px] text-gray-500">
                    Leaflet | © OpenStreetMap contributors
                </div>
            </div>
        </div>
    );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>
            <h3 className="mb-1.5 font-semibold text-gray-900">{product.name}</h3>
            <div className="mb-1.5 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{product.location}</span>
            </div>
            <div className="mb-1.5">
                <RatingStars count={product.rating} />
            </div>
            <p className="text-lg font-bold text-amber-500">₵{product.price.toLocaleString()}</p>
        </div>
    );
}

// ---------- Main page component ----------

export default function ProductDetailPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-6 md:px-10">
            <div className="mx-auto max-w-7xl">
                <Breadcrumb items={PRODUCT.breadcrumb} />

                <h1 className="mb-4 mt-3 text-2xl font-bold text-gray-900">{PRODUCT.title}</h1>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    {/* Left column */}
                    <div>
                        <ImageGallery images={PRODUCT.images} />

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {PRODUCT.postedAt}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {PRODUCT.location}
                            </span>
                        </div>

                        <div className="mt-3">
                            <PriceTag price={PRODUCT.price} />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_260px]">
                            <p className="text-sm leading-relaxed text-gray-600">{PRODUCT.description}</p>
                            <OverviewCard items={PRODUCT.overview} />
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <SellerCard seller={PRODUCT.seller} />
                    </div>
                </div>

                {/* Location + related ads */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <div>
                        <LocationMap label={PRODUCT.location} />

                        <div className="mt-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">Related Ads</h2>
                                <button className="flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                                    View All
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                                {RELATED_PRODUCTS.map((product) => (
                                    <RelatedProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div />
                </div>
            </div>
        </div>
    );
}