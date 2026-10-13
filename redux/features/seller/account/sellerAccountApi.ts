import { baseApi } from "@/redux/api/baseApi";

export type SellerBusinessDocument = {
    id: string;
    sellerId: string;
    documentUrl: string;
    status: string;
    requestedAt: string | null;
    submittedAt: string | null;
    verifiedAt: string | null;
    verifiedBy: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SellerAccount = {
    sellerType: string;
    id: string;
    userId: string;
    storeName: string;
    businessLogoUrl: string | null;
    about: string | null;
    businessType: string | null;
    customersServed: string | null;
    responseTime: string | null;
    addressLine: string | null;
    regionId: string | null;
    districtId: string | null;
    accountStatus: string;
    isVerified: boolean;
    avgRating: string;
    reviewCount: number;
    businessDocuments: SellerBusinessDocument[];
    createdAt: string;
};

type SellerAccountResponse = {
    success: boolean;
    data: SellerAccount;
};

const sellerAccountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSellerAccount: builder.query<SellerAccount, void>({
            query: () => ({
                url: "/sellers/me",
                method: "GET",
            }),
            transformResponse: (response: SellerAccountResponse) => response.data,
            providesTags: [{ type: "Profile", id: "SELLER_ME" }],
        }),
    }),
});

export const { useGetSellerAccountQuery } = sellerAccountApi;
