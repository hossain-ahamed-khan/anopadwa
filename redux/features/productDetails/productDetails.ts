import { baseApi } from "@/redux/api/baseApi";
import type {
    ListingBase,
    ListingImage,
    ListingRegion,
} from "@/redux/features/productListing/productListing";

export type ListingDetailCategory = {
    id: string;
    parentCategoryId: string | null;
    name: string;
    isActive: boolean;
    createdAt: string;
};

export type ListingDetailRegion = ListingRegion & {
    isEnabled: boolean;
};

export type ListingDetailDistrict = {
    id: string;
    regionId: string;
    name: string;
    isEnabled: boolean;
};

export type ListingDetailTown = {
    id: string;
    districtId: string;
    name: string;
    isEnabled: boolean;
};

export type CategoryAttribute = {
    id: string;
    categoryId: string;
    name: string;
    fieldType: "select" | "text" | "number" | string;
    options: string[] | null;
    isRequired: boolean;
    isFilterable: boolean;
    sortOrder: number;
};

export type ListingAttributeValue = {
    id: string;
    listingId: string;
    categoryAttributeId: string;
    valueText: string | null;
    valueNumber: number | string | null;
    categoryAttribute: CategoryAttribute;
};

export type ListingDetailSellerProfile = {
    id: string;
    userId: string;
    sellerType: "business" | "individual" | string;
    accountStatus: "active" | string;
    storeName: string | null;
    businessLogoUrl: string | null;
    about: string | null;
    businessType: string | null;
    customersServed: string | null;
    responseTime: string | null;
    regionId: string | null;
    districtId: string | null;
    addressLine: string | null;
    isVerified: boolean;
    avgRating: string | null; // comes back as a string, e.g. "4.9"
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
};

export type ListingDetailSeller = {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    createdAt: string;
    sellerProfile: ListingDetailSellerProfile | null;
};

export type ListingDetail = ListingBase & {
    rootCategory: ListingDetailCategory;
    // `category` is already on ListingBase ({ id, name }); the detail endpoint returns the full object
    category: ListingDetailCategory;
    region: ListingDetailRegion;
    district: ListingDetailDistrict;
    town: ListingDetailTown;
    attributeValues: ListingAttributeValue[];
    seller: ListingDetailSeller;
};

// Shape of items in `relatedListings` isn't confirmed yet (the sample response had an empty array),
// so it's typed like the other listing cards. Tighten once you see a real payload.
export type RelatedListing = ListingBase & {
    region?: ListingRegion;
    images: ListingImage[];
};

export type ListingDetailResponse = {
    success: boolean;
    data: {
        listing: ListingDetail;
        relatedListings: RelatedListing[];
    };
};

export type ListingDetailResult = {
    listing: ListingDetail;
    relatedListings: RelatedListing[];
};

const listingDetailApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getListingDetailApi: builder.query<ListingDetailResult, string>({
            query: (listingId) => ({
                url: `/listings/${listingId}`,
                method: 'GET',
            }),
            transformResponse: (response: ListingDetailResponse): ListingDetailResult => ({
                listing: response.data.listing,
                relatedListings: response.data.relatedListings,
            }),
        }),
    }),
});

export const { useGetListingDetailApiQuery } = listingDetailApi;