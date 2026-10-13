import { baseApi } from "@/redux/api/baseApi";

export type SellerAnalytics = {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    totalFavorites: number;
    totalInquiries: number;
    engagementRate: number;
};

type SellerAnalyticsResponse = {
    success: boolean;
    data: {
        analytics: SellerAnalytics;
    };
};

const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSellerAnalytics: builder.query<SellerAnalytics, void>({
            query: () => ({
                url: "/sellers/me/analytics",
                method: "GET",
            }),
            transformResponse: (response: SellerAnalyticsResponse) =>
                response.data.analytics,
        }),
    }),
});

export const { useGetSellerAnalyticsQuery } = analyticsApi;
