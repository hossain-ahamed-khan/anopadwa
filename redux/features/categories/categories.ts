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

const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategoryListApi: builder.query<Category[], void>({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
            transformResponse: (response: CategoriesResponse) =>
                response.data.categories,
        }),
    }),
});

export const { useGetCategoryListApiQuery } = categoriesApi;