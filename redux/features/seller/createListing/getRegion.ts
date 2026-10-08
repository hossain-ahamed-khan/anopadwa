import { baseApi } from "@/redux/api/baseApi";

export type Region = {
    id: string;
    name: string;
    isEnabled: boolean;
    _count: {
        districts: number;
    };
};

export type RegionsResponse = {
    success: boolean;
    data: {
        regions: Region[];
    };
};

const getRegionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRegions: builder.query<RegionsResponse, void>({
            query: () => ({
                url: '/regions',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetRegionsQuery } = getRegionsApi;