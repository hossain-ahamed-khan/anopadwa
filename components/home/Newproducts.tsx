import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Search, Star } from "lucide-react";

interface Product {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    imageSrc: string;
}

const PRODUCTS: Product[] = Array.from({ length: 10 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: "Kvidio Headphone 512",
    location: "Atwima Kwanwoma, Ashanti",
    rating: 4,
    reviewCount: 0,
    price: 125000,
    imageSrc: "/products/headphone-512.jpg",
}));

function formatCedis(amount: number) {
    return `₵${amount.toLocaleString("en-GH")}`;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
    return (
        <div className="flex items-center gap-1 text-xs">
            <div className="flex text-[#1F7A4D]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={12}
                        fill={i < rating ? "currentColor" : "none"}
                        strokeWidth={1.5}
                    />
                ))}
            </div>
            <span className="font-semibold text-[#1F7A4D]">
                {rating.toFixed(1)} ({reviewCount})
            </span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="relative h-40 w-full bg-white p-4">
                <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
            </div>

            <div className="flex flex-1 flex-col gap-1.5 border-t border-gray-100 px-4 py-3">
                <h3 className="text-sm font-bold text-[#1F2A44]">{product.name}</h3>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} />
                    <span>{product.location}</span>
                </div>

                <StarRating rating={product.rating} reviewCount={product.reviewCount} />

                <p className="mt-1 text-base font-bold text-[#F5A623]">
                    {formatCedis(product.price)}
                </p>
            </div>
        </Link>
    );
}

export default function NewProducts() {
    return (
        <section className="mx-4 mt-8 md:mx-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                    <h2 className="text-lg font-extrabold tracking-wide text-[#1F2A44]">
                        NEW PRODUCTS
                    </h2>
                    <p className="text-sm text-gray-400">Some of the new products arriving this weeks</p>
                </div>

                <Link
                    href="/products?sort=new"
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1F2A44] shadow-sm transition-colors hover:bg-gray-50"
                >
                    View All
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Search bar */}
            <form className="mt-5 flex overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by Product Name, Model, Keyword..."
                        className="w-full py-3.5 pl-11 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                </div>
                <button
                    type="submit"
                    className="m-1.5 shrink-0 rounded-lg bg-[#F5A623] px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#e59915]"
                >
                    Search Now
                </button>
            </form>

            {/* Product grid */}
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {PRODUCTS.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}