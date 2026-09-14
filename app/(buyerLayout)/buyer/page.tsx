"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroLeft from "@/public/image/hero-image-left.png";
import heroRight from "@/public/image/hero-image-right.png";
import productImage from "@/public/image/product-image.png";
import productImage2 from "@/public/image/mobile image.png";
import ghanaFlag from "@/public/image/ghana-flag.png";
import locationImg from "@/public/image/location-image.png"
import {
  Search,
  MapPin,
  ChevronRight,
  Star,
  RotateCw,
  ArrowRight,
  ArrowUpRight,
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
  emoji: string;
}

interface Listing {
  id: string;
  title: string;
  location: string;
  postedBy: string;
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
  { id: "vehicles", label: "Vehicles", count: 2, emoji: "🚗" },
  { id: "property", label: "Property", count: 1, emoji: "🏢" },
  { id: "phones-tablets", label: "Phones & Tablets", count: 4, emoji: "📱" },
  { id: "electronics", label: "Electronics", count: 5, emoji: "💻" },
  { id: "home-furniture", label: "Home, Furniture & Appliances", count: 1, emoji: "🛋️" },
  { id: "fashion", label: "Fashion", count: 3, emoji: "👗" },
  { id: "beauty", label: "Beauty & Personal Care", count: 2, emoji: "💄" },
  { id: "services", label: "Services", count: 1, emoji: "🔧" },
  { id: "repair-construction", label: "Repair & Construction", count: 0, emoji: "🛠️" },
  { id: "commercial-equipment", label: "Commercial Equipment & Tools", count: 4, emoji: "📦" },
  { id: "leisure", label: "Leisure & Activities", count: 3, emoji: "⛺" },
  { id: "babies-kids", label: "Babies & Kids", count: 3, emoji: "👶" },
  { id: "food-agri", label: "Food, Agriculture & Farming", count: 1, emoji: "🌾" },
  { id: "animals-pets", label: "Animals & Pets", count: 0, emoji: "🐾" },
  { id: "jobs", label: "Jobs", count: 1, emoji: "💼" },
  { id: "seeking-work", label: "Seeking Work - CVs", count: 1, emoji: "📄" },
];

const LISTINGS: Listing[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `listing-${i}`,
  title: "2017 Toyota camry SE Sedan",
  location: "Atwima Kwanwoma, Ashanti",
  postedBy: "Name",
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
    <section className="relative overflow-hidden  bg-[#E5A93C]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-[280px_1fr_320px]">
        {/* Pointing character */}
        <div className="order-2 flex justify-center md:order-1 md:justify-start">
          <div className="relative h-64 w-52 md:h-72 md:w-60">
            <Image
              src={heroLeft}
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
              className="ml-1 flex items-center gap-1 rounded-full bg-[#156240] px-3 py-1 text-xs font-semibold"
            >
              <MapPin className="h-3 w-3" aria-hidden />
              All Locations
            </button>
          </div>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-1 shadow-lg"
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white transition hover:bg-emerald-700 cursor-pointer"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>

        {/* Photo collage — tight 2x2 grid, no rotation, thin white border */}
        <div className="order-3 flex justify-end">
          <Image
            src={heroRight}
            alt="hero-right"
            width={250}
            height={250}
          />
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
    <aside className="h-fit w-full shrink-0 self-start bg-white p-4 md:w-64">
      <nav aria-label="Categories" className="space-y-1.5">
        {CATEGORIES.map(({ id, label, count, emoji }) => (
          <button
            key={id}
            type="button"
            className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-emerald-950 transition hover:bg-emerald-50 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="text-base leading-none" aria-hidden>
                {emoji}
              </span>
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
    <Link
      href={`/buyer/product/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-emerald-950/5 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative w-full overflow-hidden">
        {listing.featured && (
          <span className="absolute left-0 top-3 z-10 rounded-r-md bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
        <Image
          src={productImage2}
          alt={listing.title}
          width={350}
          height={150}
        />
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="text-sm font-semibold text-emerald-950">{listing.title}</h3>
        <p className="flex items-center gap-1 text-xs text-emerald-950/50">
          <MapPin className="h-3 w-3" aria-hidden />
          {listing.location}
        </p>
        <p className="text-xs text-emerald-950/50">Posted by: {listing.postedBy}</p>
        <div className="flex items-center gap-1 text-xs text-emerald-600">
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
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Latest Ads Section
// ---------------------------------------------------------------------------

function LatestAdsSection() {
  return (
    <section className="bg-[#F3F4F5] w-full px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row">
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
              className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-5 py-2.5 text-sm font-medium text-emerald-950 transition hover:border-emerald-700 hover:text-emerald-700 cursor-pointer"
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
    <section className="w-full px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-emerald-950">
            <span aria-hidden>
              <Image
                src={ghanaFlag}
                alt={"ghanaFlag"}
                width={30}
                height={20}
              />
            </span> How Anopadwa Works
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
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Explore Locations Section
// ---------------------------------------------------------------------------

function ExploreLocationsSection() {
  return (
    <section className="bg-[#E5A93C] py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Explore Top Locations</h2>
            <p className="mt-1 text-sm text-white/80">
              Browse listings from popular locations in one click.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 self-start rounded-full bg-[#156240] hover:bg-[#104930] px-4 py-2 text-sm font-medium text-white cursor-pointer"
          >
            See All Location
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((location) => (
            <a
              key={location.id}
              href="#"
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={locationImg}
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