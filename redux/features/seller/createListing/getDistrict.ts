import { baseApi } from "@/redux/api/baseApi";

export type District = {
    id: string;
    regionId: string;
    name: string;
    isEnabled: boolean;
    _count: {
        towns: number;
    };
};

export type DistrictsResponse = {
    success: boolean;
    data: {
        districts: District[];
    };
};

const getDistrictsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDistrictsByRegion: builder.query<DistrictsResponse, string>({
            query: (regionId) => ({
                url: `/regions/${regionId}/districts`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetDistrictsByRegionQuery } = getDistrictsApi;