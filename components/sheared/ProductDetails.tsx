'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    Clock,
    MapPin,
    MessageCircle,
    Flag,
    MessageSquare,
    Phone,
    Star,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface Breadcrumb {
    label: string;
    href: string;
}

export interface ProductImage {
    src: string;
    alt: string;
}

export interface OverviewItem {
    label: string;
    value: string;
}

export interface SellerInfo {
    name: string;
    avatarUrl?: string;
    isOnline: boolean;
    location: string;
    phone: string;
    feedbackCount: number;
}

export interface RelatedAd {
    id: string;
    title: string;
    image: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: string;
    href: string;
    featured?: boolean;
}

export interface ProductDetailProps {
    breadcrumbs: Breadcrumb[];
    title: string;
    images: ProductImage[];
    postedAt: string;
    location: string;
    price: string;
    description: string;
    overview: OverviewItem[];
    seller: SellerInfo;
    relatedAds: RelatedAd[];
}

/* -------------------------------------------------------------------------- */
/*  Breadcrumb                                                                 */
/* -------------------------------------------------------------------------- */

function ProductBreadcrumb({ items }: { items: Breadcrumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                        {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                        {isLast ? (
                            <span className="font-medium text-emerald-700">{item.label}</span>
                        ) : (
                            <Link href={item.href} className="text-slate-500 hover:text-slate-700">
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

/* -------------------------------------------------------------------------- */
/*  Image gallery                                                              */
/* -------------------------------------------------------------------------- */

function ImageGallery({ images }: { images: ProductImage[] }) {
    const router = useRouter();
    const activeIndex = 0;
    const active = images[activeIndex];

    return (
        <div>
            <div className="relative aspect-[16/8.5] w-full overflow-hidden rounded-md border border-slate-200 bg-white">
                {active && (
                    <Image
                        src={active.src}
                        alt={active.alt}
                        fill
                        sizes="(min-width: 1024px) 960px, 100vw"
                        className="object-contain p-4 sm:p-8"
                        priority
                    />
                )}
            </div>

            {images.length > 1 && (
                <div className="mt-5 flex gap-4 overflow-x-auto pb-1">
                    {images.map((image, i) => (
                        <button
                            key={image.src + i}
                            type="button"
                            onClick={() => router.push('/login')}
                            aria-label={`Show image ${i + 1}`}
                            aria-pressed={i === activeIndex}
                            className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-md border bg-white transition sm:h-24 sm:w-28 ${i === activeIndex
                                ? 'border-emerald-700 ring-1 ring-emerald-700'
                                : 'border-slate-200 hover:border-slate-400'
                                }`}
                        >
                            <Image src={image.src} alt={image.alt} fill sizes="80px" className="object-contain p-1.5" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Price ribbon                                                               */
/* -------------------------------------------------------------------------- */

function PriceRibbon({ price }: { price: string }) {
    return (
        <div className="relative inline-flex">
            <span className="bg-emerald-600 py-2 pl-4 pr-9 text-lg font-semibold text-white [clip-path:polygon(0_0,100%_0,88%_100%,0%_100%)]">
                {price}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Overview table                                                             */
/* -------------------------------------------------------------------------- */

function OverviewTable({ items }: { items: OverviewItem[] }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="border-b border-slate-100 pb-3 text-sm font-semibold text-slate-900">
                Overview
            </h2>
            <dl className="divide-y divide-slate-100">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 text-sm">
                        <dt className="text-slate-500">{item.label}</dt>
                        <dd className="font-medium text-slate-900">{item.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Seller card                                                                */
/* -------------------------------------------------------------------------- */

function SellerCard({ seller, onLogin }: { seller: SellerInfo; onLogin: () => void }) {
    const maskedPhone = `${seller.phone.slice(0, 6)}${'X'.repeat(Math.max(seller.phone.length - 6, 0))}`;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-sm font-semibold text-slate-900">
                Seller Information
            </h2>

            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                    {seller.avatarUrl ? (
                        <Image
                            src={seller.avatarUrl}
                            alt={seller.name}
                            width={44}
                            height={44}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        seller.name.charAt(0).toUpperCase()
                    )}
                </div>
                <div>
                    <p className="font-semibold text-slate-900">{seller.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${seller.isOnline ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                        />
                        {seller.isOnline ? 'Online Now' : 'Offline Now'}
                    </p>
                </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 shrink-0" />
                {seller.location}
            </p>

            <button
                type="button"
                onClick={onLogin}
                className="mt-4 flex w-full flex-col items-center gap-1 rounded-lg bg-slate-50 py-3 text-sm transition hover:bg-slate-100"
            >
                <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <Phone className="h-4 w-4" />
                    {maskedPhone}
                </span>
                <span className="text-xs text-slate-500">Click to reveal phone number</span>
            </button>

            <button
                type="button"
                onClick={onLogin}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 cursor-pointer"
            >
                <MessageCircle className="h-4 w-4" />
                Chat
            </button>

            <button
                type="button"
                onClick={onLogin}
                className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-sm font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
                <Flag className="h-3.5 w-3.5" />
                Report this listing
            </button>

            <button
                type="button"
                onClick={onLogin}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 cursor-pointer"
            >
                <MessageSquare className="h-4 w-4" />
                {seller.feedbackCount} Feedback
            </button>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Related ad card                                                            */
/* -------------------------------------------------------------------------- */

function RelatedAdCard({ ad }: { ad: RelatedAd }) {
    return (
        <Link
            href={ad.href}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
        >
            <div className="relative aspect-[4/3] w-full bg-slate-100">
                {ad.featured && (
                    <span className="absolute left-0 top-3 z-10 rounded-r-md bg-amber-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        Featured
                    </span>
                )}
                <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-3.5">
                <h3 className="line-clamp-1 text-sm font-medium text-slate-900">{ad.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {ad.location}
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-medium text-slate-700">{ad.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({ad.reviewCount})</span>
                </p>
                <p className="mt-1.5 text-sm font-semibold text-emerald-700">{ad.price}</p>
            </div>
        </Link>
    );
}

/* -------------------------------------------------------------------------- */
/*  Location map (static placeholder — swap for a real map component)         */
/* -------------------------------------------------------------------------- */

function LocationMap({ location }: { location: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 border-b border-slate-100 pb-3 text-sm font-semibold text-slate-900">
                Location
            </h2>
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,#cbd5e1_1px,transparent_1px),linear-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="relative flex flex-col items-center gap-1.5">
                    <MapPin className="h-8 w-8 fill-emerald-600 text-emerald-700" />
                    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                        {location}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ProductDetailPage({
    breadcrumbs,
    title,
    images,
    postedAt,
    location,
    price,
    description,
    overview,
    seller,
    relatedAds,
}: ProductDetailProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#f4f4f4]">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <ProductBreadcrumb items={breadcrumbs} />

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>

                <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left column */}
                    <div className="space-y-6 lg:col-span-2">
                        <ImageGallery images={images} />

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {postedAt}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {location}
                            </span>
                        </div>

                        <PriceRibbon price={price} />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_260px]">
                            <div className="rounded-xl border border-slate-200 bg-white p-5">
                                <h2 className="mb-2 text-sm font-semibold text-slate-900">Description</h2>
                                <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                            </div>
                            <OverviewTable items={overview} />
                        </div>

                        <LocationMap location={location} />

                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-1">
                        <SellerCard
                            seller={seller}
                            onLogin={() => router.push('/login')}
                        />
                    </div>
                </div>
            </div>
            {relatedAds.length > 0 && (
                <section className="py-10 mx-auto max-w-6xl">
                    <h2 className="mb-4 text-base font-semibold text-slate-900">Related Ads</h2>
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedAds.map((ad) => (
                            <RelatedAdCard key={ad.id} ad={ad} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}