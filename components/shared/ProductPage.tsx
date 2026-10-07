"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import ProductDetailPage from "@/components/sheared/ProductDetails";
import productImage from "@/public/image/product-image.png";
// TODO: adjust this path to wherever listingDetailApi.ts lives in your project
import {
    useGetListingDetailApiQuery,
    type ListingDetail,
    type RelatedListing,
} from "@/redux/features/productDetails/productDetails";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: string, currency: string): string {
    const amount = Number(price);
    const value = Number.isFinite(amount) ? amount.toLocaleString("en-GH") : price;
    const symbol = currency?.toUpperCase() === "GHS" ? "₵" : `${currency} `;
    return `${symbol}${value}`;
}

function formatPostedAt(iso: string | null): string {
    if (!iso) return "Posted recently";
    const diffMs = Date.now() - new Date(iso).getTime();
    if (!Number.isFinite(diffMs) || diffMs < 0) return "Posted recently";

    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return "Posted just now";
    if (minutes < 60) return `Posted ${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Posted ${hours} ${hours === 1 ? "hour" : "hours"} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `Posted ${days} ${days === 1 ? "day" : "days"} ago`;

    return `Posted on ${new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })}`;
}

function capitalize(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function buildLocation(listing: ListingDetail): string {
    return [listing.town?.name, listing.district?.name, listing.region?.name]
        .filter(Boolean)
        .join(", ");
}

function buildImages(listing: ListingDetail) {
    const sorted = [...(listing.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

    if (sorted.length === 0) {
        return [{ src: productImage.src, alt: `${listing.title} placeholder` }];
    }

    return sorted.map((img, index) => ({
        src: img.imageUrl,
        alt: `${listing.title} image ${index + 1}`,
    }));
}

function buildOverview(listing: ListingDetail) {
    const base = [
        { label: "Condition", value: capitalize(listing.condition) },
        { label: "Price type", value: capitalize(listing.pricingType) },
        { label: "Category", value: listing.category?.name },
    ];

    // Dynamic category attributes (Bedrooms, Make, Year, ...)
    const attributes = [...(listing.attributeValues ?? [])]
        .sort(
            (a, b) =>
                (a.categoryAttribute?.sortOrder ?? 0) - (b.categoryAttribute?.sortOrder ?? 0),
        )
        .map((attr) => ({
            label: attr.categoryAttribute?.name,
            value: attr.valueText ?? (attr.valueNumber != null ? String(attr.valueNumber) : ""),
        }));

    return [...base, ...attributes].filter(
        (row): row is { label: string; value: string } => Boolean(row.label && row.value),
    );
}

function buildRelatedAds(related: RelatedListing[], basePath: string) {
    return related.map((item) => {
        const cover = [...(item.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)[0];

        return {
            id: item.id,
            title: item.title,
            image: cover?.thumbnailUrl || cover?.imageUrl || productImage.src,
            location: item.region?.name ?? "",
            rating: 0,
            reviewCount: 0,
            price: formatPrice(item.price, item.currency),
            href: `${basePath}/${item.id}`,
            featured: false,
        };
    });
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

function ProductPageSkeleton() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-10" aria-busy="true">
            <div className="mb-6 h-4 w-64 animate-pulse rounded bg-emerald-950/5" />
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                <div className="space-y-4">
                    <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-emerald-950/5" />
                    <div className="h-7 w-3/4 animate-pulse rounded bg-emerald-950/5" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-emerald-950/5" />
                    <div className="h-24 w-full animate-pulse rounded bg-emerald-950/5" />
                </div>
                <div className="h-64 animate-pulse rounded-xl bg-emerald-950/5" />
            </div>
        </main>
    );
}

function ProductPageMessage({
    title,
    description,
    onRetry,
}: {
    title: string;
    description: string;
    onRetry?: () => void;
}) {
    return (
        <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
            <h1 className="text-xl font-semibold text-emerald-950">{title}</h1>
            <p className="text-sm text-emerald-950/60">{description}</p>
            <div className="mt-2 flex items-center gap-4">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-full bg-emerald-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 cursor-pointer"
                    >
                        Try again
                    </button>
                )}
                <Link
                    href="/"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                    Back to home
                </Link>
            </div>
        </main>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductPage({
    params,
    basePath,
}: {
    params: Promise<{ id: string }>;
    basePath: string;
}) {
    const { id } = use(params);

    const { data, isLoading, isError, error, refetch } = useGetListingDetailApiQuery(id, {
        skip: !id,
    });

    const listing = data?.listing;
    const relatedListings = data?.relatedListings;

    const images = useMemo(() => (listing ? buildImages(listing) : []), [listing]);
    const overview = useMemo(() => (listing ? buildOverview(listing) : []), [listing]);
    const relatedAds = useMemo(
        () => buildRelatedAds(relatedListings ?? [], basePath),
        [relatedListings, basePath],
    );

    if (isLoading) return <ProductPageSkeleton />;

    if (isError || !listing) {
        const isNotFound =
            !!error && "status" in error && (error.status === 404 || error.status === 400);

        return isNotFound ? (
            <ProductPageMessage
                title="Ad not found"
                description="This listing may have been removed or the link is incorrect."
            />
        ) : (
            <ProductPageMessage
                title="Couldn't load this ad"
                description="Something went wrong while loading the listing. Please try again."
                onRetry={refetch}
            />
        );
    }

    const location = buildLocation(listing);
    const profile = listing.seller?.sellerProfile;

    return (
        <ProductDetailPage
            breadcrumbs={[
                { label: "Home", href: "/" },
                ...(listing.rootCategory
                    ? [{ label: listing.rootCategory.name, href: "/" }]
                    : []),
                ...(listing.category && listing.category.id !== listing.rootCategory?.id
                    ? [{ label: listing.category.name, href: "/" }]
                    : []),
                { label: listing.title, href: `${basePath}/${listing.id}` },
            ]}
            title={listing.title}
            listingId={listing.id}
            images={images}
            postedAt={formatPostedAt(listing.publishedAt ?? listing.createdAt)}
            location={location}
            price={formatPrice(listing.price, listing.currency)}
            description={listing.description}
            overview={overview}
            seller={{
                name: profile?.storeName || listing.seller?.fullName || "Seller",
                // The API doesn't return online presence yet
                isOnline: false,
                location: profile?.addressLine || location,
                phone: listing.contactPhone ?? "",
                feedbackCount: profile?.reviewCount ?? 0,
            }}
            relatedAds={relatedAds}
        />
    );
}