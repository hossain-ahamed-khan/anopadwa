import { baseApi } from "@/redux/api/baseApi";
import type { TUser } from "./authSlice";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TLoginResponse, TLoginRequest>({
            query: (userInfo) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useLoginMutation } = authApi;

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