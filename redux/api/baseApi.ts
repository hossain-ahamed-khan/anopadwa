import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
    // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    baseUrl: "https://umber.sobhoy.com/api/v1",
    // credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery,
    tagTypes: ['Profile', 'Listings', 'Reports', 'Conversations', 'Conversation', 'Messages', 'UnreadCount', 'Users'],
    endpoints: () => ({})
})
