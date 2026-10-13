"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock3, Tag } from "lucide-react";
import {
    useGetMyListingsQuery,
    useLazyGetListingPerformanceQuery,
    type ListingPerformance,
    type MyListing,
} from "@/redux/features/seller/createListing/listingApi";

type PerformanceListing = {
    listing: MyListing;
    performance: ListingPerformance;
};

const formatDate = (date: string | null) =>
    date
        ? new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "Not published";

const formatAge = (ageInDays: number) =>
    `${ageInDays} ${ageInDays === 1 ? "Day" : "Days"} Ago`;

export default function ListingPerformanceView() {
    const {
        data: listingsData,
        isLoading: isLoadingListings,
        isError: isListingsError,
    } = useGetMyListingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [getListingPerformance, { isFetching: isLoadingPerformance }] =
        useLazyGetListingPerformanceQuery();
    const [performanceListings, setPerformanceListings] = useState<PerformanceListing[]>(
        [],
    );
    const [isPerformanceError, setIsPerformanceError] = useState(false);

    const listings = listingsData?.data.listings;

    useEffect(() => {
        let isMounted = true;
        const currentListings = listingsData?.data.listings ?? [];

        if (currentListings.length === 0) {
            return () => {
                isMounted = false;
            };
        }

        Promise.all(
            currentListings.map(async (listing) => ({
                listing,
                performance: await getListingPerformance(listing.id).unwrap(),
            })),
        )
            .then((results) => {
                if (isMounted) {
                    setPerformanceListings(results);
                    setIsPerformanceError(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setPerformanceListings([]);
                    setIsPerformanceError(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [getListingPerformance, listingsData]);

    const isLoading = isLoadingListings || isLoadingPerformance;
    const isError = isListingsError || Boolean(listings && isPerformanceError);

    return (
        <section className="rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto px-5">
                <div className="min-w-[760px]">
                    <div className="grid grid-cols-[80px_minmax(0,1fr)_110px_90px_90px_110px_110px] gap-4 border-b border-slate-100 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <span>Thumbnail</span>
                        <span>Title</span>
                        <span>Listing Views</span>
                        <span>Favorites</span>
                        <span>Inquiries</span>
                        <span>Listing Age</span>
                        <span>Promotion</span>
                    </div>

                    {isLoading ? (
                        <p className="py-10 text-center text-sm text-slate-400">
                            Loading performance...
                        </p>
                    ) : isError ? (
                        <p className="py-10 text-center text-sm text-red-500">
                            Unable to load listing performance. Please try again.
                        </p>
                    ) : !listings || listings.length === 0 ? (
                        <p className="py-10 text-center text-sm text-slate-400">
                            No listings found.
                        </p>
                    ) : performanceListings.length === 0 ? (
                        <p className="py-10 text-center text-sm text-slate-400">
                            No performance data yet.
                        </p>
                    ) : (
                        performanceListings.map(({ listing, performance }) => {
                            const image = listing.images[0];
                            return (
                                <div
                                    key={listing.id}
                                    className="grid grid-cols-[80px_minmax(0,1fr)_110px_90px_90px_110px_110px] items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
                                >
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-slate-200 bg-white">
                                        {image ? (
                                            <Image
                                                src={image.thumbnailUrl || image.imageUrl}
                                                alt={listing.title}
                                                fill
                                                sizes="64px"
                                                className="object-contain p-1"
                                            />
                                        ) : null}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate text-sm font-semibold text-slate-800">
                                                {performance.title || listing.title}
                                            </h3>
                                            {performance.ageInDays <= 2 && (
                                                <span className="shrink-0 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {formatDate(performance.createdAt)}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                            <Tag className="h-3.5 w-3.5" />
                                            <span className="truncate">{listing.category.name}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600">{performance.viewsCount}</p>
                                    <p className="text-sm text-slate-600">{performance.favoritesCount}</p>
                                    <p className="text-sm text-slate-600">{performance.inquiriesCount}</p>
                                    <p className="text-sm text-slate-600">{formatAge(performance.ageInDays)}</p>
                                    <p className="text-sm text-slate-600">—</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}