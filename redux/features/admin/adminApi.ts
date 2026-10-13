import { baseApi } from "@/redux/api/baseApi";
import type { ListingImage } from "@/redux/features/seller/createListing/listingApi";

export type AdminDashboardOverview = {
    headerStats: {
        activeListings: number;
        totalGmv: number;
    };
    usersOverview: {
        total: number;
        todayNew: number;
        active: number;
    };
    sellersOverview: {
        total: number;
        todayNew: number;
        active: number;
        individual: number;
        business: number;
    };
    buyersOverview: {
        total: number;
        todayNew: number;
        active: number;
    };
    earnings: {
        timeframe: string;
        monthly: Array<{
            month: string;
            revenue: number;
        }>;
    };
    salesOverview: {
        timeframe: string;
        daily: Array<{
            day: string;
            date: string;
            listings: number;
            sales: number;
            value: number;
        }>;
    };
    topProducts: Array<{
        id: string;
        title: string;
        views: number;
        price: number;
        category: string;
        image: string;
    }>;
    overview: {
        users: {
            total: number;
            active: number;
            buyers: number;
            sellers: {
                total: number;
                individual: number;
                business: number;
            };
        };
        listings: {
            total: number;
            pendingModeration: number;
            active: number;
            sold: number;
        };
    };
};

type AdminDashboardOverviewResponse = {
    success: boolean;
    data: AdminDashboardOverview;
};

export type AdminSellerProfileSummary = {
    id: string;
    storeName: string;
    sellerType: "individual" | "business";
    accountStatus: "active" | "suspended";
    isVerified: boolean;
};

export type AdminUser = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePhotoUrl: string | null;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isSeller: boolean;
    isActive: boolean;
    tokenVersion: number;
    createdAt: string;
    updatedAt: string;
    sellerProfile: AdminSellerProfileSummary | null;
    _count: {
        listings: number;
        authoredReviews?: number;
        sellerReviews?: number;
    };
};

export type AdminUserDetails = AdminUser & {
    sellerProfile: (AdminSellerProfileSummary & {
        userId: string;
        businessLogoUrl: string | null;
        about: string | null;
        businessType: string | null;
        customersServed: string | null;
        responseTime: string | null;
        regionId: string | null;
        districtId: string | null;
        addressLine: string | null;
        avgRating: string;
        reviewCount: number;
        createdAt: string;
        updatedAt: string;
        region: { id: string; name: string; isEnabled: boolean } | null;
        district: { id: string; regionId: string; name: string; isEnabled: boolean } | null;
    }) | null;
    businessDocuments: Array<{
        id: string;
        documentUrl: string;
        status: string;
        requestedAt: string | null;
        submittedAt: string | null;
        verifiedAt: string | null;
    }>;
};

type AdminUsersResponse = {
    success: boolean;
    data: { users: AdminUser[] };
    meta: { total: number; page: number; limit: number; totalPages: number };
};

type AdminUserResponse = {
    success: boolean;
    data: { user: AdminUserDetails };
};

type AdminActionResponse = {
    success: boolean;
    data: {
        user?: AdminUser;
        profile?: AdminUserDetails["sellerProfile"];
        message: string;
    };
};

export type AdminDocument = {
    id: string;
    sellerId: string;
    documentUrl: string;
    status: "submitted" | "verified" | "rejected" | string;
    requestedAt: string | null;
    submittedAt: string | null;
    verifiedAt: string | null;
    verifiedBy: string | null;
    createdAt: string;
    updatedAt: string;
    verifiedByAdmin: string | null;
};

type AdminDocumentsResponse = {
    success: boolean;
    data: { documents: AdminDocument[] };
};

type AdminDocumentActionResponse = {
    success: boolean;
    data: {
        document: AdminDocument;
        message: string;
    };
};

export type AdminListing = {
    id: string;
    sellerId: string;
    title: string;
    price: string;
    currency: string;
    status: "pending" | "approved" | "rejected" | "deactivated" | "draft" | "sold" | "expired";
    createdAt: string;
    rejectionReason: string | null;
    images: ListingImage[];
    category: {
        id: string;
        name: string;
    };
    seller: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        sellerProfile: {
            storeName: string;
            sellerType: "individual" | "business";
            accountStatus: "active" | "suspended";
        } | null;
    };
};

export type AdminListingDetails = Omit<AdminListing, "category" | "seller"> & {
    description: string;
    condition: string;
    pricingType: string;
    contactPhone: string | null;
    contactWhatsapp: string | null;
    contactEmail: string | null;
    viewsCount: number;
    favoritesCount: number;
    inquiriesCount: number;
    publishedAt: string | null;
    expiresAt: string | null;
    category: {
        id: string;
        parentCategoryId: string | null;
        name: string;
        isActive: boolean;
        createdAt: string;
    };
    rootCategory?: {
        id: string;
        name: string;
    } | null;
    region?: {
        id: string;
        name: string;
    } | null;
    district?: {
        id: string;
        name: string;
    } | null;
    town?: {
        id: string;
        name: string;
    } | null;
    attributeValues: Array<{
        valueText: string | null;
        valueNumber: string | null;
        categoryAttribute?: {
            name: string;
        } | null;
    }>;
    seller: {
        id: string;
        fullName: string;
        profilePhotoUrl?: string | null;
        sellerProfile: {
            storeName: string;
            sellerType: "individual" | "business";
            accountStatus: "active" | "suspended";
            isVerified?: boolean;
        } | null;
    };
};

type AdminListingDetailsResponse = {
    success: boolean;
    data: {
        listing: AdminListingDetails;
    };
};

type AdminListingsResponse = {
    success: boolean;
    data: { listings: AdminListing[] };
    meta: { total: number; page: number; limit: number; totalPages: number };
};

type AdminListingActionResponse = {
    success: boolean;
    data: {
        listing?: AdminListing;
        reason?: string;
        message: string;
    };
};

export type AdminReportStatus = "pending" | "reviewed" | "dismissed" | "action_taken";

export type AdminListingReport = {
    id: string;
    listingId: string;
    reporterUserId: string;
    reason: string;
    details: string | null;
    status: AdminReportStatus;
    actionTaken?: string | null;
    createdAt: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    listing: {
        id: string;
        title: string;
        status: string;
        price: number | string;
        sellerId: string;
        seller: {
            id: string;
            fullName: string;
            email: string;
        };
        images: Array<{ imageUrl: string }>;
    };
    reporter: {
        id: string;
        fullName: string;
        email: string;
    };
    reviewer: {
        id: string;
        fullName: string;
        email: string;
    } | null;
};

type AdminReportsResponse = {
    success: boolean;
    data: { reports: AdminListingReport[] };
    meta: { total: number; page: number; limit: number; totalPages: number };
};

type AdminReportActionResponse = {
    success: boolean;
    data: {
        report: AdminListingReport;
        message: string;
    };
};

const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboardOverview: builder.query<AdminDashboardOverview, void>({
            query: () => ({
                url: "/admin/dashboard/overview",
                method: "GET",
            }),
            transformResponse: (response: AdminDashboardOverviewResponse) => response.data,
        }),
        getAdminUsers: builder.query<
            AdminUsersResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: ({ page = 1, limit = 20, search = "" }) => ({
                url: "/admin/users",
                method: "GET",
                params: { page, limit, ...(search ? { search } : {}) },
            }),
            providesTags: ["Users"],
        }),
        getAdminUser: builder.query<AdminUserDetails, string>({
            query: (id) => `/admin/users/${id}`,
            transformResponse: (response: AdminUserResponse) => response.data.user,
            providesTags: (_result, _error, id) => [{ type: "Users", id }],
        }),
        getAdminUserDocuments: builder.query<AdminDocument[], string>({
            query: (id) => `/admin/users/${id}/documents`,
            transformResponse: (response: AdminDocumentsResponse) => response.data.documents,
            providesTags: (_result, _error, id) => [{ type: "Users", id: `documents-${id}` }],
        }),
        verifyAdminUserDocument: builder.mutation<AdminDocumentActionResponse, string>({
            query: (id) => ({
                url: `/admin/users/${id}/documents/verify`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [
                "Users",
                { type: "Users", id },
                { type: "Users", id: `documents-${id}` },
            ],
        }),
        rejectAdminUserDocument: builder.mutation<
            AdminDocumentActionResponse,
            { id: string; reason: string }
        >({
            query: ({ id, reason }) => ({
                url: `/admin/users/${id}/documents/reject`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Users",
                { type: "Users", id },
                { type: "Users", id: `documents-${id}` },
            ],
        }),
        activateAdminUser: builder.mutation<AdminActionResponse, string>({
            query: (id) => ({ url: `/admin/users/${id}/activate`, method: "POST" }),
            invalidatesTags: (_result, _error, id) => ["Users", { type: "Users", id }],
        }),
        deactivateAdminUser: builder.mutation<AdminActionResponse, string>({
            query: (id) => ({ url: `/admin/users/${id}/deactivate`, method: "POST" }),
            invalidatesTags: (_result, _error, id) => ["Users", { type: "Users", id }],
        }),
        suspendAdminSeller: builder.mutation<AdminActionResponse, string>({
            query: (id) => ({ url: `/admin/users/${id}/suspend-seller`, method: "POST" }),
            invalidatesTags: (_result, _error, id) => ["Users", { type: "Users", id }],
        }),
        reactivateAdminSeller: builder.mutation<AdminActionResponse, string>({
            query: (id) => ({ url: `/admin/users/${id}/reactivate-seller`, method: "POST" }),
            invalidatesTags: (_result, _error, id) => ["Users", { type: "Users", id }],
        }),
        getAdminListings: builder.query<AdminListingsResponse, { page?: number; limit?: number } | void>({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: "/admin/listings",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["Listings"],
        }),
        getAdminListing: builder.query<AdminListingDetails, string>({
            query: (id) => `/listings/${id}`,
            transformResponse: (response: AdminListingDetailsResponse) => response.data.listing,
            providesTags: (_result, _error, id) => [{ type: "Listings", id }],
        }),
        approveAdminListing: builder.mutation<AdminListingActionResponse, string>({
            query: (id) => ({
                url: `/admin/listings/${id}/approve`,
                method: "POST",
            }),
            invalidatesTags: ["Listings"],
        }),
        rejectAdminListing: builder.mutation<
            AdminListingActionResponse,
            { id: string; reason: string }
        >({
            query: ({ id, reason }) => ({
                url: `/admin/listings/${id}/reject`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: ["Listings"],
        }),
        deactivateAdminListing: builder.mutation<AdminListingActionResponse, string>({
            query: (id) => ({
                url: `/admin/listings/${id}/deactivate`,
                method: "POST",
            }),
            invalidatesTags: ["Listings"],
        }),
        removeAdminListing: builder.mutation<AdminListingActionResponse, string>({
            query: (id) => ({
                url: `/admin/listings/${id}/remove`,
                method: "POST",
            }),
            invalidatesTags: ["Listings"],
        }),
    }),
});

export const {
    useGetAdminDashboardOverviewQuery,
    useGetAdminUsersQuery,
    useGetAdminUserQuery,
    useGetAdminUserDocumentsQuery,
    useVerifyAdminUserDocumentMutation,
    useRejectAdminUserDocumentMutation,
    useActivateAdminUserMutation,
    useDeactivateAdminUserMutation,
    useSuspendAdminSellerMutation,
    useReactivateAdminSellerMutation,
    useGetAdminListingsQuery,
    useLazyGetAdminListingQuery,
    useApproveAdminListingMutation,
    useRejectAdminListingMutation,
    useDeactivateAdminListingMutation,
    useRemoveAdminListingMutation,
} = adminApi;
