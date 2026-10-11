import { baseApi } from "@/redux/api/baseApi";
import type { TAdmin, TUser } from "./authSlice";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TLoginResponse, TLoginRequest>({
            query: (userInfo) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo
            })
        }),
        adminLogin: builder.mutation<TAdminLoginResponse, TLoginRequest>({
            query: (credentials) => ({
                url: '/admin/auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        adminMe: builder.query<TAdminMeResponse, void>({
            query: () => ({
                url: '/admin/auth/me',
                method: 'GET',
            })
        }),
    })
})

export const { useLoginMutation, useAdminLoginMutation, useAdminMeQuery } = authApi;

export type TLoginRequest = {
    email: string;
    password: string;
};

export type TLoginResponse = {
    success: boolean;
    data: {
        user: TUser;
        accessToken: string;
        refreshToken: string;
    };
};

export type TAdminLoginResponse = {
    success: boolean;
    data: {
        token: string;
        admin: TAdmin;
    };
};

export type TAdminMeResponse = {
    success: boolean;
    data: {
        admin: TAdmin;
    };
};