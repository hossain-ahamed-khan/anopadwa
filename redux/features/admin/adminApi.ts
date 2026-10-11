import { baseApi } from "@/redux/api/baseApi";

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

const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboardOverview: builder.query<AdminDashboardOverview, void>({
            query: () => ({
                url: "/admin/dashboard/overview",
                method: "GET",
            }),
            transformResponse: (response: AdminDashboardOverviewResponse) => response.data,
        }),
    }),
});

export const { useGetAdminDashboardOverviewQuery } = adminApi;
