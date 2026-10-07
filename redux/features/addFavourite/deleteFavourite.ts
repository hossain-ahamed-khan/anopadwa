import { baseApi } from "@/redux/api/baseApi";

export type DeleteFavouriteResponse = {
    success: boolean;
    message?: string;
};

const deleteFavouriteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteFavourite: builder.mutation<DeleteFavouriteResponse, string>({
            query: (listingId) => ({
                url: `/listings/${listingId}/favourite`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useDeleteFavouriteMutation } = deleteFavouriteApi;