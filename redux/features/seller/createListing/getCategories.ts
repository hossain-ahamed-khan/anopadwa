import { baseApi } from "@/redux/api/baseApi";

export type Category = {
    id: string;
    parentCategoryId: string | null;
    name: string;
    isActive: boolean;
    createdAt: string;
    subCategories: Category[];
};

export type CategoriesResponse = {
    success: boolean;
    data: {
        categories: Category[];
    };
};

const getCategoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<CategoriesResponse, void>({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetCategoriesQuery } = getCategoriesApi;