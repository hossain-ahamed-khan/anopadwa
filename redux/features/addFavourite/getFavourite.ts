import { baseApi } from "@/redux/api/baseApi";

export type FavouriteListingImage = {
    imageUrl: string;
    thumbnailUrl: string;
    sortOrder: number;
};

export type FavouriteListing = {
    id: string;
    title: string;
    description: string;
    condition: string;
    price: string;
    currency: string;
    images: FavouriteListingImage[];
    seller: {
        fullName: string;
    };
};

export type Favourite = {
    id: string;
    createdAt: string;
    listing: FavouriteListing;
};

export type FavouritesResponse = {
    success: boolean;
    data: {
        favourites: Favourite[];
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

const getFavouritesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFavourites: builder.query<FavouritesResponse, void>({
            query: () => ({
                url: '/users/me/favourites',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetFavouritesQuery } = getFavouritesApi;