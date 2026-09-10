"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  ChevronRight,
  Star,
  RotateCw,
  ArrowRight,
  ArrowUpRight,
  Car,
  Building2,
  Smartphone,
  Cpu,
  Sofa,
  Shirt,
  Sparkles,
  Wrench,
  Hammer,
  Boxes,
  Tent,
  Baby,
  Wheat,
  PawPrint,
  Briefcase,
  FileText,
  MessageCircle,
  UserRound,
  Repeat,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Category {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
}

interface Listing {
  id: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  featured?: boolean;
}

interface LocationCard {
  id: string;
  name: string;
  adsCount: number;
  image: string;
}

// ---------------------------------------------------------------------------
// Data (swap with RTK Query hooks, e.g. useGetCategoriesQuery / useGetListingsQuery)
// ---------------------------------------------------------------------------

const CATEGORIES: Category[] = [
  { id: "vehicles", label: "Vehicles", count: 2, icon: Car },
  { id: "property", label: "Property", count: 1, icon: Building2 },
  { id: "phones-tablets", label: "Phones & Tablets", count: 4, icon: Smartphone },
  { id: "electronics", label: "Electronics", count: 5, icon: Cpu },
  { id: "home-furniture", label: "Home, Furniture & Appliances", count: 1, icon: Sofa },
  { id: "fashion", label: "Fashion", count: 3, icon: Shirt },
  { id: "beauty", label: "Beauty & Personal Care", count: 2, icon: Sparkles },
  { id: "services", label: "Services", count: 1, icon: Wrench },
  { id: "repair-construction", label: "Repair & Construction", count: 0, icon: Hammer },
  { id: "commercial-equipment", label: "Commercial Equipment & Tools", count: 4, icon: Boxes },
  { id: "leisure", label: "Leisure & Activities", count: 3, icon: Tent },
  { id: "babies-kids", label: "Babies & Kids", count: 3, icon: Baby },
  { id: "food-agri", label: "Food, Agriculture & Farming", count: 1, icon: Wheat },
  { id: "animals-pets", label: "Animals & Pets", count: 0, icon: PawPrint },
  { id: "jobs", label: "Jobs", count: 1, icon: Briefcase },
  { id: "seeking-work", label: "Seeking Work - CVs", count: 1, icon: FileText },
];

const LISTINGS: Listing[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `listing-${i}`,
  title: "2017 Toyota Camry SE Sedan",
  location: "Atwima Kwanwoma, Ashanti",
  rating: 4.0,
  price: 125000,
  image: "/images/listings/camry.jpg",
  featured: true,
}));

const LOCATIONS: LocationCard[] = Array.from({ length: 4 }).map((_, i) => ({
  id: `location-${i}`,
  name: "Accra Metropolitan",
  adsCount: 5,
  image: "/images/locations/accra.jpg",
}));

const HOW_IT_WORKS = [
  {
    id: "post",
    title: "Post Your Ad",
    description: "Create your ad in minutes and add photos.",
    icon: ArrowUpRight,
  },
  {
    id: "reach",
    title: "Reach Buyers",
    description: "Thousands of buyers see your ad daily.",
    icon: UserRound,
  },
  {
    id: "chat",
    title: "Connect & Chat",
    description: "Chat with interested buyers instantly.",
    icon: MessageCircle,
  },
  {
    id: "close",
    title: "Close the Deal",
    description: "Meet, test and trust — complete the deal.",
    icon: Repeat,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCedis(amount: number): string {
  return `₵${amount.toLocaleString("en-GH")}`;
}

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

function HeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-emerald-800">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-14 md:grid-cols-[280px_1fr_320px] md:py-16">
        {/* Pointing character */}
        <div className="order-2 flex justify-center md:order-1 md:justify-start">
          <div className="relative h-64 w-52 md:h-72 md:w-60">
            <Image
              src="/images/hero/pointing-guy.png"
              alt="Person pointing toward the search bar"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* Search */}
        <div className="order-1 flex flex-col items-center gap-3 text-center md:order-2">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-50">
            <MapPin className="h-4 w-4 text-emerald-300" aria-hidden />
            <span>Find anything in Ghana</span>
            <button
              type="button"
              className="ml-1 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-emerald-950 transition hover:bg-amber-300"
            >
              <MapPin className="h-3 w-3" aria-hidden />
              All Locations
            </button>
          </div>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm text-emerald-950 placeholder:text-emerald-950/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white transition hover:bg-emerald-700"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>

        {/* Photo collage */}
        <div className="order-3 hidden grid-cols-2 gap-3 md:grid">
          <div className="relative col-span-1 row-span-1 -translate-y-2 rotate-[-3deg] overflow-hidden rounded-xl border-4 border-white shadow-lg">
            <Image
              src="/images/hero/collage-phones.jpg"
              alt="Phones for sale"
              width={140}
              height={110}
              className="h-28 w-full object-cover"
            />
          </div>
          <div className="relative col-span-1 row-span-1 translate-y-2 rotate-[3deg] overflow-hidden rounded-xl border-4 border-white shadow-lg">
            <Image
              src="/images/hero/collage-electronics.jpg"
              alt="Electronics for sale"
              width={140}
              height={110}
              className="h-28 w-full object-cover"
            />
          </div>
          <div className="relative col-span-1 row-span-1 translate-y-2 rotate-[2deg] overflow-hidden rounded-xl border-4 border-white shadow-lg">
            <Image
              src="/images/hero/collage-car.jpg"
              alt="Car for sale"
              width={140}
              height={110}
              className="h-28 w-full object-cover"
            />
          </div>
          <div className="relative col-span-1 row-span-1 -translate-y-2 rotate-[-2deg] overflow-hidden rounded-xl border-4 border-white shadow-lg">
            <Image
              src="/images/hero/collage-market.jpg"
              alt="Market goods for sale"
              width={140}
              height={110}
              className="h-28 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Category Sidebar
// ---------------------------------------------------------------------------

function CategorySidebar() {
  return (
    <aside className="w-full shrink-0 md:w-64">
      <nav aria-label="Categories" className="space-y-1">
        {CATEGORIES.map(({ id, label, count, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-emerald-950 transition hover:bg-emerald-50"
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-emerald-700" aria-hidden />
              <span>
                {label} <span className="text-emerald-950/40">({count})</span>
              </span>
            </span>
            <ChevronRight
              className="h-4 w-4 text-emerald-950/30 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
              aria-hidden
            />
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Listing Card
// ---------------------------------------------------------------------------

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-emerald-950/5 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {listing.featured && (
          <span className="absolute left-0 top-3 z-10 rounded-r-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="text-sm font-semibold text-emerald-950">{listing.title}</h3>
        <p className="flex items-center gap-1 text-xs text-emerald-950/50">
          <MapPin className="h-3 w-3" aria-hidden />
          {listing.location}
        </p>
        <div className="flex items-center gap-1 text-xs text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5"
              fill={i < Math.round(listing.rating) ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
          <span className="ml-1 text-emerald-950/50">({listing.rating.toFixed(1)})</span>
        </div>
        <p className="pt-1 text-base font-bold text-emerald-800">
          {formatCedis(listing.price)}
        </p>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Latest Ads Section
// ---------------------------------------------------------------------------

function LatestAdsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        <CategorySidebar />

        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-950">Latest Posted Ad</h2>
            <a
              href="#"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LISTINGS.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-5 py-2.5 text-sm font-medium text-emerald-950 transition hover:border-emerald-700 hover:text-emerald-700"
            >
              <RotateCw className="h-4 w-4" aria-hidden />
              Load More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How It Works Section
// ---------------------------------------------------------------------------

function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 text-center">
        <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-emerald-950">
          <span aria-hidden>🇬🇭</span> How Anopadwa Works
        </h2>
        <span className="mx-auto mt-2 block h-0.5 w-10 bg-emerald-700" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map(({ id, title, description, icon: Icon }) => (
          <div
            key={id}
            className="rounded-xl border border-emerald-950/5 bg-white p-6 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <Icon className="h-5 w-5 text-emerald-700" aria-hidden />
            </div>
            <h3 className="text-sm font-semibold text-emerald-950">{title}</h3>
            <p className="mt-1 text-xs text-emerald-950/50">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Explore Locations Section
// ---------------------------------------------------------------------------

function ExploreLocationsSection() {
  return (
    <section className="bg-emerald-800 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Explore Top Locations</h2>
            <p className="mt-1 text-sm text-emerald-100/70">
              Browse listings from popular locations in one click.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-50 sm:self-auto"
          >
            See All Locations
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((location) => (
            <a
              key={location.id}
              href="#"
              className="group relative block aspect-[4/5] overflow-hidden rounded-xl"
            >
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-white">{location.name}</p>
                  <p className="text-xs text-white/70">{location.adsCount} Ads Posted</p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-emerald-950 transition group-hover:bg-white">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnopaHomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <LatestAdsSection />
      <HowItWorksSection />
      <ExploreLocationsSection />
    </main>
  );
}