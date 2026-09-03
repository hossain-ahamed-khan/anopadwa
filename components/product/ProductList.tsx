"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Star, MapPin } from "lucide-react";

// ---------- Types ----------

interface Product {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    image: string;
}

interface FilterOption {
    id: string;
    label: string;
}

interface FilterSectionProps {
    title: string;
    options: FilterOption[];
    selected: string[];
    onToggle: (id: string) => void;
    showSeeAll?: boolean;
}

// ---------- Static filter data ----------

const CATEGORIES = [
    "Mobile accessory",
    "Electronics",
    "Smartphones",
    "Modern tech",
];

const BRAND_OPTIONS: FilterOption[] = [
    { id: "samsung", label: "Samsung" },
    { id: "apple", label: "Apple" },
    { id: "huawei", label: "Huawei" },
    { id: "pocco", label: "Pocco" },
    { id: "lenovo", label: "Lenovo" },
];

const FEATURE_OPTIONS: FilterOption[] = [
    { id: "metallic", label: "Metallic" },
    { id: "plastic-cover", label: "Plastic cover" },
    { id: "8gb-ram", label: "8GB Ram" },
    { id: "super-power", label: "Super power" },
    { id: "large-memory", label: "Large Memory" },
];

// ---------- Mock product data ----------

const PRODUCTS: Product[] = Array.from({ length: 12 }, (_, i) => ({
    id: `kvidio-512-${i}`,
    name: "Kvidio Headphone 512",
    location: "Atwima Kwanwoma, Ashanti",
    rating: 4,
    reviewCount: 0,
    price: 125000,
    image: "/headphone-placeholder.png",
}));

// ---------- Small building blocks ----------

function Breadcrumb() {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-indigo-600 font-medium">TWS</span>
        </nav>
    );
}

function FilterSection({
    title,
    options,
    selected,
    onToggle,
    showSeeAll = true,
}: FilterSectionProps) {
    const [open, setOpen] = useState(true);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="font-semibold text-gray-900">{title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${open ? "" : "-rotate-90"
                        }`}
                />
            </button>

            {open && (
                <div className="mt-3 space-y-2.5">
                    {options.map((option) => (
                        <label
                            key={option.id}
                            className="flex cursor-pointer items-center gap-2.5"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option.id)}
                                onChange={() => onToggle(option.id)}
                                className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                    {showSeeAll && (
                        <button className="pt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            See all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function CollapsibleHeader({ title }: { title: string }) {
    const [open, setOpen] = useState(false);

    return (
        <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between border-b border-gray-200 py-4 text-left"
        >
            <span className="font-semibold text-gray-900">{title}</span>
            <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""
                    }`}
            />
        </button>
    );
}

function RatingStars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < count ? "fill-green-600 text-green-600" : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs font-medium text-green-700">
                ({count}.
            </span>
            <span className="text-xs text-gray-500">0)</span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
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
            <p className="text-lg font-bold text-amber-500">
                ₵{product.price.toLocaleString()}
            </p>
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    pageSize: number;
    onPageSizeChange: (n: number) => void;
}) {
    return (
        <div className="mt-8 flex items-center justify-end gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {[10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${p === page
                                ? "bg-indigo-100 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 disabled:opacity-40"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// ---------- Main page component ----------

export default function ProductListingPage() {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([
        "samsung",
        "apple",
        "pocco",
    ]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
        "metallic",
    ]);
    const [sortBy, setSortBy] = useState("price-low-high");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalItems = 109;
    const totalPages = 3;

    const toggleBrand = (id: string) =>
        setSelectedBrands((prev) =>
            prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
        );

    const toggleFeature = (id: string) =>
        setSelectedFeatures((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-6 md:px-10">
            <div className="mx-auto max-w-7xl">
                <Breadcrumb />

                <h1 className="mb-3 mt-4 text-2xl font-bold text-gray-900">
                    TWS Price in Bangladesh
                </h1>
                <p className="mb-8 max-w-4xl text-sm leading-relaxed text-gray-600">
                    TWS Price in Bangladesh starts from BDT 1,000 and depending on the
                    features and brand, the price may go up to BDT 25,000 or more. At
                    Star Tech, you can get the latest TWS Earbuds from popular brands
                    like Xiaomi, Realme, Samsung, and more. Browse below and order
                    yours now!
                </p>

                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Sidebar */}
                    <aside className="w-full shrink-0 md:w-64">
                        <FilterSection
                            title="Category"
                            options={CATEGORIES.map((c) => ({ id: c, label: c }))}
                            selected={[]}
                            onToggle={() => { }}
                        />
                        <FilterSection
                            title="Brands"
                            options={BRAND_OPTIONS}
                            selected={selectedBrands}
                            onToggle={toggleBrand}
                        />
                        <FilterSection
                            title="Features"
                            options={FEATURE_OPTIONS}
                            selected={selectedFeatures}
                            onToggle={toggleFeature}
                        />
                        <CollapsibleHeader title="Price range" />
                        <CollapsibleHeader title="Condition" />
                        <CollapsibleHeader title="Ratings" />
                        <CollapsibleHeader title="Manufacturer" />
                    </aside>

                    {/* Main content */}
                    <main className="flex-1">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-sm text-gray-600">
                                {totalItems} items in TWS
                            </span>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">Sort by</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-md border border-gray-300 px-3 py-2 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="price-low-high">Price Low to High</option>
                                    <option value="price-high-low">Price High to Low</option>
                                    <option value="newest">Newest</option>
                                    <option value="top-rated">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6 flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-1 shadow-sm">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Product Name, Model, Keyword..."
                                className="flex-1 border-none bg-transparent py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                            />
                            <button className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                                Search Now
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {PRODUCTS.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            pageSize={pageSize}
                            onPageSizeChange={setPageSize}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}