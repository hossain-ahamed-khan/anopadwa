import { baseApi } from "@/redux/api/baseApi";

export type AddFavouriteResponse = {
    success: boolean;
    data: {
        favourite: {
            id: string;
            userId: string;
            listingId: string;
            createdAt: string;
        };
        message: string;
    };
};

const addFavouriteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addFavourite: builder.mutation<AddFavouriteResponse, string>({
            query: (listingId) => ({
                url: `/listings/${listingId}/favourite`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: "Profile", id: "ME" }],
        }),
    }),
});

export const { useAddFavouriteMutation } = addFavouriteApi;