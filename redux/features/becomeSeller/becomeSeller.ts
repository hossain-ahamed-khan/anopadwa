import { baseApi } from "@/redux/api/baseApi";

export type SellerType = "individual" | "business";

export type BecomeSellerRequest = {
    sellerType: SellerType;
    storeName: string;
};

export type BecomeSellerResponse = {
    success: boolean;
    data: {
        sellerType: SellerType;
        id: string;
        userId: string;
        fullName: string;
        profilePhotoUrl: string | null;
        about: string | null;
        region: string | null;
        district: string | null;
        accountStatus: string;
        isVerified: boolean;
        message: string;
    };
};

const becomeSellerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        becomeSeller: builder.mutation<
            BecomeSellerResponse,
            BecomeSellerRequest
        >({
            query: (formData) => ({
                url: '/users/me/become-seller',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: "Profile", id: "ME" }],
        }),
    }),
});

export const { useBecomeSellerMutation } = becomeSellerApi;