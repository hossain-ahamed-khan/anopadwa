"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroLeft from "@/public/image/hero-image-left.png";
import heroRight from "@/public/image/hero-image-right.png";
import productImage2 from "@/public/image/mobile image.png";
import ghanaFlag from "@/public/image/ghana-flag.png";
import locationImg from "@/public/image/location-image.png";
import {
  Search,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  BadgeCheck,
  RotateCw,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  UserRound,
  Repeat,
  Eye,
  X,
} from "lucide-react";

// TODO: adjust these two import paths to wherever the API files live in your project
import {
  useGetFeaturedProductListApiQuery,
  useGetPromotedProductListApiQuery,
  useGetRecentProductListApiQuery,
  useSearchListingsApiQuery,
  type ListingBase,
  type SearchListing,
} from "@/redux/features/productListing/productListing";
import {
  useGetCategoryListApiQuery,
  type Category,
} from "@/redux/features/categories/categories";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LocationCard {
  id: string;
  name: string;
  adsCount: number;
  image: string;
}

// Works for every listing endpoint: featured/recent have region, promoted has none,
// search results also carry district, town and seller
type CardListing = ListingBase &
  Partial<Pick<SearchListing, "region" | "district" | "town" | "seller">>;

type BadgeVariant = "featured" | "promoted" | "none";

interface CategoryFilter {
  id: string;
  level: "root" | "sub";
}

// ---------------------------------------------------------------------------
// Static data (locations don't have an API yet)
// ---------------------------------------------------------------------------

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

// The API has no emoji, so map by category name with a fallback
const CATEGORY_EMOJI: Record<string, string> = {
  vehicles: "🚗",
  property: "🏢",
  "phones & tablets": "📱",
  electronics: "💻",
  "home, furniture & appliances": "🛋️",
  fashion: "👗",
  "beauty & personal care": "💄",
  services: "🔧",
  "repair & construction": "🛠️",
  "commercial equipment & tools": "📦",
  "leisure & activities": "⛺",
  "babies & kids": "👶",
  "food, agriculture & farming": "🌾",
  "animals & pets": "🐾",
  jobs: "💼",
  "seeking work - cvs": "📄",
};

const INITIAL_RECENT_COUNT = 9;
const RECENT_STEP = 9;
const SEARCH_DEBOUNCE_MS = 400;
const SEARCH_PAGE_SIZE = 12;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getEmoji(name: string): string {
  return CATEGORY_EMOJI[name.trim().toLowerCase()] ?? "🏷️";
}

function formatPrice(price: string, currency: string): string {
  const amount = Number(price);
  const value = Number.isFinite(amount) ? amount.toLocaleString("en-GH") : price;
  const symbol = currency?.toUpperCase() === "GHS" ? "₵" : `${currency} `;
  return `${symbol}${value}`;
}

function filterListings<T extends ListingBase>(
  listings: T[] | undefined,
  filter: CategoryFilter | null,
): T[] {
  if (!listings) return [];
  if (!filter) return listings;
  return listings.filter((l) =>
    filter.level === "root"
      ? l.rootCategoryId === filter.id
      : l.categoryId === filter.id,
  );
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

interface HeroSectionProps {
  query: string;
  onQueryChange: (value: string) => void;
}

function HeroSection({ query, onQueryChange }: HeroSectionProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    document
      .getElementById("listings-area")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-1 shadow-lg"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search products by name"
              className="w-full bg-transparent text-sm text-emerald-950 placeholder:text-emerald-950/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-emerald-950/40 transition hover:text-emerald-950 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white transition hover:bg-emerald-700 cursor-pointer"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>

        {/* Hero image */}
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

interface CategorySidebarProps {
  categories: Category[] | undefined;
  isLoading: boolean;
  isError: boolean;
  selected: CategoryFilter | null;
  onSelect: (filter: CategoryFilter | null) => void;
  onRetry: () => void;
}

function CategorySidebar({
  categories,
  isLoading,
  isError,
  selected,
  onSelect,
  onRetry,
}: CategorySidebarProps) {
  const rootCategories = useMemo(
    () => (categories ?? []).filter((c) => c.isActive && !c.parentCategoryId),
    [categories],
  );

  // A root is "open" if it, or one of its children, is selected
  const openRootId = useMemo(() => {
    if (!selected) return null;
    if (selected.level === "root") return selected.id;
    return (
      rootCategories.find((r) =>
        r.subCategories?.some((s) => s.id === selected.id),
      )?.id ?? null
    );
  }, [selected, rootCategories]);

  return (
    <aside className="h-fit w-full shrink-0 self-start bg-white p-4 md:w-64">
      {isLoading && (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-emerald-950/5" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="space-y-2 text-sm text-emerald-950/70">
          <p>Couldn&apos;t load categories.</p>
          <button
            type="button"
            onClick={onRetry}
            className="font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <nav aria-label="Categories" className="space-y-1.5">
          {selected && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="mb-2 flex w-full items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-left text-xs font-medium text-emerald-800 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear category filter
            </button>
          )}

          {rootCategories.map((cat) => {
            const isOpen = openRootId === cat.id;
            const isSelectedRoot =
              selected?.level === "root" && selected.id === cat.id;
            const subs = (cat.subCategories ?? []).filter((s) => s.isActive);

            return (
              <div key={cat.id}>
                <button
                  type="button"
                  onClick={() =>
                    onSelect(
                      isSelectedRoot ? null : { id: cat.id, level: "root" },
                    )
                  }
                  aria-expanded={subs.length ? isOpen : undefined}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition cursor-pointer ${isSelectedRoot
                    ? "bg-emerald-50 font-medium text-emerald-800"
                    : "text-emerald-950 hover:bg-emerald-50"
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base leading-none" aria-hidden>
                      {getEmoji(cat.name)}
                    </span>
                    <span>{cat.name}</span>
                  </span>
                  {isOpen && subs.length > 0 ? (
                    <ChevronDown
                      className="h-4 w-4 text-emerald-700"
                      aria-hidden
                    />
                  ) : (
                    <ChevronRight
                      className="h-4 w-4 text-emerald-950/30 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
                      aria-hidden
                    />
                  )}
                </button>

                {isOpen && subs.length > 0 && (
                  <ul className="ml-9 mt-1 space-y-0.5 border-l border-emerald-950/10 pl-3">
                    {subs.map((sub) => {
                      const active =
                        selected?.level === "sub" && selected.id === sub.id;
                      return (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() =>
                              onSelect(
                                active
                                  ? { id: cat.id, level: "root" }
                                  : { id: sub.id, level: "sub" },
                              )
                            }
                            className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition cursor-pointer ${active
                              ? "bg-emerald-50 font-medium text-emerald-800"
                              : "text-emerald-950/70 hover:bg-emerald-50"
                              }`}
                          >
                            {sub.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}

          {rootCategories.length === 0 && (
            <p className="px-3 py-2 text-sm text-emerald-950/50">No categories yet.</p>
          )}
        </nav>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Listing Card
// ---------------------------------------------------------------------------

function ListingCard({
  listing,
  badge = "none",
}: {
  listing: CardListing;
  badge?: BadgeVariant;
}) {
  const cover = useMemo(
    () => [...(listing.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)[0],
    [listing.images],
  );
  const imageSrc = cover?.thumbnailUrl || cover?.imageUrl;
  const location = [listing.town?.name, listing.region?.name]
    .filter(Boolean)
    .join(", ");
  const sellerName =
    listing.seller?.sellerProfile?.storeName || listing.seller?.fullName;

  return (
    <Link
      href={`/buyer/product/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-emerald-950/5 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-950/5">
        {badge !== "none" && (
          <span
            className={`absolute left-0 top-3 z-10 rounded-r-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${badge === "featured" ? "bg-amber-500" : "bg-emerald-700"
              }`}
          >
            {badge === "featured" ? "Featured" : "Promoted"}
          </span>
        )}
        {imageSrc ? (
          // unoptimized avoids having to whitelist the API's image host in next.config;
          // remove it once remotePatterns is configured
          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={productImage2}
            alt={listing.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="space-y-1.5 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-emerald-950">
          {listing.title}
        </h3>
        {location && (
          <p className="flex items-center gap-1 text-xs text-emerald-950/50">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </p>
        )}
        {sellerName && (
          <p className="flex items-center gap-1 text-xs text-emerald-950/50">
            <span className="truncate">{sellerName}</span>
            {listing.seller?.sellerProfile?.isVerified && (
              <BadgeCheck
                className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                aria-label="Verified seller"
              />
            )}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-emerald-950/50">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 capitalize text-emerald-800">
            {listing.condition}
          </span>
          <span className="truncate">{listing.category?.name}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-base font-bold text-emerald-800">
            {formatPrice(listing.price, listing.currency)}
          </p>
          <span className="flex items-center gap-1 text-xs text-emerald-950/40">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {listing.viewsCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-950/5 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse bg-emerald-950/5" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-emerald-950/5" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-emerald-950/5" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-emerald-950/5" />
        <div className="h-5 w-1/4 animate-pulse rounded bg-emerald-950/5" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable listing section (one per listing type)
// ---------------------------------------------------------------------------

interface ListingsSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  listings: CardListing[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  badge?: BadgeVariant;
  isFiltered: boolean;
  showViewAll?: boolean;
  footer?: React.ReactNode;
}

function ListingsSection({
  id,
  title,
  subtitle,
  listings,
  isLoading,
  isError,
  onRetry,
  badge = "none",
  isFiltered,
  showViewAll = true,
  footer,
}: ListingsSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 id={`${id}-title`} className="text-lg font-semibold text-emerald-950">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-emerald-950/50">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <a
            href="#"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            View All
          </a>
        )}
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-xl border border-emerald-950/10 bg-white p-6 text-center text-sm text-emerald-950/70">
          <p>Something went wrong while loading {title.toLowerCase()}.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <div className="rounded-xl border border-dashed border-emerald-950/15 bg-white p-6 text-center text-sm text-emerald-950/50">
          {isFiltered
            ? "No ads match your search or category."
            : "No ads to show right now."}
        </div>
      )}

      {!isLoading && !isError && listings.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} badge={badge} />
          ))}
        </div>
      )}

      {footer}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Listings area: sidebar + Featured / Promoted / Latest sections
// ---------------------------------------------------------------------------

interface ListingsAreaProps {
  searchTerm: string; // debounced + trimmed; empty string means "not searching"
  isTyping: boolean; // input is ahead of the debounced term
  searchPage: number;
  onSearchPageChange: (page: number) => void;
  onClearSearch: () => void;
}

function ListingsArea({
  searchTerm,
  isTyping,
  searchPage,
  onSearchPageChange,
  onClearSearch,
}: ListingsAreaProps) {
  const [filter, setFilter] = useState<CategoryFilter | null>(null);
  const [recentVisible, setRecentVisible] = useState(INITIAL_RECENT_COUNT);

  const isSearching = searchTerm.length > 0;

  const categoriesQuery = useGetCategoryListApiQuery();
  const featuredQuery = useGetFeaturedProductListApiQuery();
  const promotedQuery = useGetPromotedProductListApiQuery();
  const recentQuery = useGetRecentProductListApiQuery();
  const searchQuery = useSearchListingsApiQuery(
    { q: searchTerm, page: searchPage, limit: SEARCH_PAGE_SIZE },
    { skip: !isSearching },
  );

  const featured = useMemo(
    () => filterListings(featuredQuery.data, filter),
    [featuredQuery.data, filter],
  );
  const promoted = useMemo(
    () => filterListings(promotedQuery.data, filter),
    [promotedQuery.data, filter],
  );
  const recent = useMemo(
    () => filterListings(recentQuery.data, filter),
    [recentQuery.data, filter],
  );
  const searchResults = useMemo(
    () => filterListings(searchQuery.data?.listings, filter),
    [searchQuery.data, filter],
  );

  const meta = searchQuery.data?.meta;
  const isSearchLoading = isTyping || searchQuery.isFetching;
  const resultCount = filter ? searchResults.length : (meta?.total ?? 0);

  const handleSelect = (next: CategoryFilter | null) => {
    setFilter(next);
    setRecentVisible(INITIAL_RECENT_COUNT);
  };

  const goToSearchPage = (page: number) => {
    onSearchPageChange(page);
    document
      .getElementById("listings-area")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleRecent = recent.slice(0, recentVisible);
  const hasMoreRecent = recent.length > recentVisible;

  return (
    <section id="listings-area" className="bg-[#F3F4F5] w-full px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row">
        <CategorySidebar
          categories={categoriesQuery.data}
          isLoading={categoriesQuery.isLoading}
          isError={categoriesQuery.isError}
          selected={filter}
          onSelect={handleSelect}
          onRetry={categoriesQuery.refetch}
        />

        <div className="min-w-0 flex-1 space-y-12">
          {isSearching ? (
            <>
              <div
                role="status"
                className="flex items-center justify-between gap-3 rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-emerald-950"
              >
                <p>
                  {isSearchLoading || searchQuery.isError
                    ? "Searching for "
                    : `${resultCount} ${resultCount === 1 ? "result" : "results"} for `}
                  <span className="font-semibold">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                  {isSearchLoading && "…"}
                </p>
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  Clear search
                </button>
              </div>

              <ListingsSection
                id="search-results"
                title="Search Results"
                listings={searchResults}
                isLoading={isSearchLoading}
                isError={searchQuery.isError}
                onRetry={searchQuery.refetch}
                isFiltered
                showViewAll={false}
                footer={
                  meta && meta.totalPages > 1 ? (
                    <nav
                      aria-label="Search results pagination"
                      className="mt-8 flex items-center justify-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => goToSearchPage(searchPage - 1)}
                        disabled={searchPage <= 1 || searchQuery.isFetching}
                        className="flex items-center gap-1 rounded-full border border-emerald-950/10 bg-white px-4 py-2 text-sm font-medium text-emerald-950 transition hover:border-emerald-700 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden />
                        Previous
                      </button>
                      <span className="text-sm text-emerald-950/60">
                        Page {meta.page} of {meta.totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => goToSearchPage(searchPage + 1)}
                        disabled={
                          searchPage >= meta.totalPages ||
                          searchQuery.isFetching
                        }
                        className="flex items-center gap-1 rounded-full border border-emerald-950/10 bg-white px-4 py-2 text-sm font-medium text-emerald-950 transition hover:border-emerald-700 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </button>
                    </nav>
                  ) : null
                }
              />
            </>
          ) : (
            <>
              <ListingsSection
                id="featured-ads"
                title="Featured Ads"
                subtitle="Hand-picked listings you shouldn't miss."
                listings={featured}
                isLoading={featuredQuery.isLoading}
                isError={featuredQuery.isError}
                onRetry={featuredQuery.refetch}
                badge="featured"
                isFiltered={!!filter}
              />

              <ListingsSection
                id="promoted-ads"
                title="Promoted Ads"
                subtitle="Sellers boosting their listings for more reach."
                listings={promoted}
                isLoading={promotedQuery.isLoading}
                isError={promotedQuery.isError}
                onRetry={promotedQuery.refetch}
                badge="promoted"
                isFiltered={!!filter}
              />

              <ListingsSection
                id="latest-ads"
                title="Latest Posted Ad"
                listings={visibleRecent}
                isLoading={recentQuery.isLoading}
                isError={recentQuery.isError}
                onRetry={recentQuery.refetch}
                isFiltered={!!filter}
                footer={
                  hasMoreRecent ? (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setRecentVisible((n) => n + RECENT_STEP)
                        }
                        className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-5 py-2.5 text-sm font-medium text-emerald-950 transition hover:border-emerald-700 hover:text-emerald-700 cursor-pointer"
                      >
                        <RotateCw className="h-4 w-4" aria-hidden />
                        Load More
                      </button>
                    </div>
                  ) : null
                }
              />
            </>
          )}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);

  const trimmedQuery = searchQuery.trim();
  const searchTerm = useDebouncedValue(trimmedQuery, SEARCH_DEBOUNCE_MS);
  const isTyping = trimmedQuery !== searchTerm;

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setSearchPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchPage(1);
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroSection query={searchQuery} onQueryChange={handleSearchQueryChange} />
      <ListingsArea
        searchTerm={searchTerm}
        isTyping={isTyping}
        searchPage={searchPage}
        onSearchPageChange={setSearchPage}
        onClearSearch={handleClearSearch}
      />
      <HowItWorksSection />
      <ExploreLocationsSection />
    </main>
  );
}