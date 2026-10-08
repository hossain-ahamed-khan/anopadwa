import { baseApi } from "@/redux/api/baseApi";

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'expired';

export type ListingImage = {
    id: string;
    listingId: string;
    imageUrl: string;
    thumbnailUrl: string;
    sortOrder: number;
    width: number | null;
    height: number | null;
    fileSizeBytes: number | null;
    isBlurry: boolean;
    qualityScore: number | null;
    isDuplicate: boolean;
    perceptualHash: string | null;
    uploadedAt: string;
};

export type Listing = {
    id: string;
    sellerId: string;
    categoryId: string;
    rootCategoryId: string;
    title: string;
    description: string;
    contentLanguage: string;
    condition: string;
    pricingType: string;
    price: string;
    currency: string;
    regionId: string;
    districtId: string;
    townId: string | null;
    postCode: string | null;
    contactPhone: string | null;
    contactWhatsapp: string | null;
    contactEmail: string | null;
    status: ListingStatus;
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
    rejectionReason: string | null;
    moderatedBy: string | null;
    moderatedAt: string | null;
    createdAt: string;
    updatedAt: string;
    images: ListingImage[];
};

// Item returned by GET /sellers/me/listings
export type MyListing = Listing & {
    category: {
        id: string;
        name: string;
    };
};

// Item returned by POST /listings and PATCH /listings/:id
export type ListingDetail = Listing & {
    category: {
        id: string;
        parentCategoryId: string | null;
        name: string;
        isActive: boolean;
        createdAt: string;
    };
    attributeValues: unknown[];
};

export type GetMyListingsParams = {
    status?: ListingStatus;
    page?: number;
    limit?: number;
};

export type MyListingsResponse = {
    success: boolean;
    data: {
        listings: MyListing[];
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

// Fields sent as multipart/form-data when creating a listing.
// Build a FormData from this and append every image under the "images" key.
export type CreateListingFields = {
    title: string;
    description: string;
    categoryId: string;
    condition: string;
    pricingType: string;
    price: string;
    currency: string;
    regionId: string;
    districtId: string;
    publish: boolean;
};

export type CreateListingResponse = {
    success: boolean;
    data: {
        listing: ListingDetail;
        message: string;
    };
};

export type UpdateListingBody = Partial<
    Omit<CreateListingFields, 'publish'>
>;

export type UpdateListingArgs = {
    id: string;
    body: UpdateListingBody;
};

export type UpdateListingResponse = {
    success: boolean;
    data: {
        listing: ListingDetail;
    };
};

export type DeleteListingResponse = {
    success: boolean;
    data: {
        message: string;
    };
};

const listingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyListings: builder.query<MyListingsResponse, GetMyListingsParams | void>({
            query: (params) => ({
                url: '/sellers/me/listings',
                method: 'GET',
                params: params ?? undefined,
            }),
            providesTags: ['Listings'],
        }),

        createListing: builder.mutation<CreateListingResponse, FormData>({
            query: (formData) => ({
                url: '/listings',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Listings'],
        }),

        updateListing: builder.mutation<UpdateListingResponse, UpdateListingArgs>({
            query: ({ id, body }) => ({
                url: `/listings/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Listings'],
        }),

        deleteListing: builder.mutation<DeleteListingResponse, string>({
            query: (id) => ({
                url: `/listings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Listings'],
        }),
    }),
});

export const {
    useGetMyListingsQuery,
    useCreateListingMutation,
    useUpdateListingMutation,
    useDeleteListingMutation,
} = listingsApi;