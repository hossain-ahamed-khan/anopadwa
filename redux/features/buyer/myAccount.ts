import { baseApi } from "@/redux/api/baseApi";

/* ----------------------------- Shared types ----------------------------- */

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type PaginationParams = {
    page?: number;
    limit?: number;
};

export type Paginated<T> = {
    items: T[];
    meta: PaginationMeta;
};

/* ------------------------------- Profile -------------------------------- */

// Shape unknown (null in your sample) – update when you have a real response
export type SellerProfile = Record<string, unknown>;

export type UserProfile = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePhotoUrl: string | null;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isSeller: boolean;
    isActive: boolean;
    sellerProfile: SellerProfile | null;
    businessDocumentStatus: string; // e.g. "not_requested"
    createdAt: string;
    updatedAt: string;
};

export type ProfileResponse = {
    success: boolean;
    data: UserProfile;
};

/* ---------------------------- Conversations ----------------------------- */

// Placeholder – list was empty, replace with the real item shape
export type Conversation = {
    id: string;
    [key: string]: unknown;
};

export type ConversationsResponse = {
    success: boolean;
    data: {
        conversations: Conversation[];
    };
    meta: PaginationMeta;
};

/* -------------------------------- Endpoints ------------------------------ */

const buyerAccountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyProfileApi: builder.query<UserProfile, void>({
            query: () => ({
                url: '/users/me',
                method: 'GET',
            }),
            transformResponse: (response: ProfileResponse) => response.data,
            providesTags: [{ type: "Profile", id: "ME" }],
        }),

        getConversationListApi: builder.query<
            Paginated<Conversation>,
            PaginationParams | void
        >({
            query: (params) => ({
                url: '/chat/conversations',
                method: 'GET',
                params: params ?? undefined,
            }),
            transformResponse: (response: ConversationsResponse) => ({
                items: response.data.conversations,
                meta: response.meta,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetMyProfileApiQuery,
    useGetConversationListApiQuery,
} = buyerAccountApi;