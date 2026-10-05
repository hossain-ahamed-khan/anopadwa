import { baseApi } from "@/redux/api/baseApi";

export type ListingImage = {
    id: string;
    listingId: string;
    imageUrl: string;
    thumbnailUrl: string;
    sortOrder: number;
    width: number;
    height: number;
    fileSizeBytes: number;
    isBlurry: boolean;
    qualityScore: number | null;
    isDuplicate: boolean;
    perceptualHash: string | null;
    uploadedAt: string;
};

export type ListingCategory = {
    id: string;
    name: string;
};

export type ListingRegion = {
    id: string;
    name: string;
};

export type ListingDistrict = {
    id: string;
    name: string;
};

export type ListingTown = {
    id: string;
    name: string;
};

export type ListingSellerProfile = {
    storeName: string | null;
    sellerType: "business" | "individual" | string;
    isVerified: boolean;
    avgRating: string | null; // comes back as a string, e.g. "4.9"
};

export type ListingSeller = {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    sellerProfile: ListingSellerProfile | null;
};

export type PromotionType = {
    id: string;
    name: string;
    description: string;
    price: string;
    durationDays: number;
    isActive: boolean;
    createdAt: string;
};

export type ListingPromotion = {
    id: string;
    listingId: string;
    promotionTypeId: string;
    transactionId: string;
    startsAt: string;
    endsAt: string;
    status: "active" | string;
    createdAt: string;
    promotionType: PromotionType;
};

// Fields shared by /listings/featured, /listings/promoted, /listings/recent and /listings?q=
export type ListingBase = {
    id: string;
    sellerId: string;
    categoryId: string;
    rootCategoryId: string;
    title: string;
    description: string;
    contentLanguage: string;
    condition: "new" | "used" | "refurbished" | string;
    pricingType: "fixed" | "negotiable" | string;
    price: string; // comes back as a string, e.g. "4800000"
    currency: string;
    regionId: string;
    districtId: string;
    townId: string;
    postCode: string | null;
    contactPhone: string | null;
    contactWhatsapp: string | null;
    contactEmail: string | null;
    status: string;
    isAiAssisted: boolean;
    aiGeneratedTitle: boolean;
    aiGeneratedDescription: boolean;
    aiConfidenceScore: number | null;
    viewsCount: number;
    favoritesCount: number;
    inquiriesCount: number;
    publishedAt: string | null;
    soldAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    images: ListingImage[];
    category: ListingCategory;
};

// /listings/featured and /listings/recent
export type Listing = ListingBase & {
    region: ListingRegion;
};

export type ListingsResponse = {
    success: boolean;
    data: {
        listings: Listing[];
    };
};

export type FeaturedListingsResponse = ListingsResponse;
export type RecentListingsResponse = ListingsResponse;

// /listings/promoted
export type PromotedListing = ListingBase & {
    promotions: ListingPromotion[];
};

export type PromotedListingsResponse = {
    success: boolean;
    data: {
        listings: PromotedListing[];
    };
};

// /listings?q=...
export type SearchListing = Listing & {
    district: ListingDistrict;
    town: ListingTown;
    seller: ListingSeller;
};

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type SearchListingsResponse = {
    success: boolean;
    data: {
        listings: SearchListing[];
    };
    meta: PaginationMeta;
};

export type SearchListingsArgs = {
    q: string;
    page?: number;
    limit?: number;
};

export type SearchListingsResult = {
    listings: SearchListing[];
    meta: PaginationMeta;
};

const featuredProductListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFeaturedProductListApi: builder.query<Listing[], void>({
            query: () => ({
                url: '/listings/featured',
                method: 'GET',
            }),
            transformResponse: (response: FeaturedListingsResponse) =>
                response.data.listings,
        }),

        getPromotedProductListApi: builder.query<PromotedListing[], void>({
            query: () => ({
                url: '/listings/promoted',
                method: 'GET',
            }),
            transformResponse: (response: PromotedListingsResponse) =>
                response.data.listings,
        }),

        getRecentProductListApi: builder.query<Listing[], void>({
            query: () => ({
                url: '/listings/recent',
                method: 'GET',
            }),
            transformResponse: (response: RecentListingsResponse) =>
                response.data.listings,
        }),

        searchListingsApi: builder.query<SearchListingsResult, SearchListingsArgs>({
            query: ({ q, page = 1, limit = 20 }) => ({
                url: '/listings',
                method: 'GET',
                params: { q, page, limit },
            }),
            transformResponse: (response: SearchListingsResponse): SearchListingsResult => ({
                listings: response.data.listings,
                meta: response.meta,
            }),
        }),
    }),
});

export const {
    useGetFeaturedProductListApiQuery,
    useGetPromotedProductListApiQuery,
    useGetRecentProductListApiQuery,
    useSearchListingsApiQuery,
} = featuredProductListApi;