import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<TRegisterResponse, TRegisterRequest>({
            query: (userInfo) => ({
                url: '/auth/register',
                method: 'POST',
                body: userInfo,
            }),
        }),
        verifyOtp: builder.mutation<TVerifyOtpResponse, TVerifyOtpRequest>({
            query: (payload) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const { useRegisterMutation, useVerifyOtpMutation } = authApi;

export type TRegisterRequest = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
};

export type TRegisterResponse = {
    success: boolean;
    data: {
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            isSeller: boolean;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
        };
        otp: {
            destination: string;
            message: string;
            devCode?: string;
        };
    };
};

export type TVerifyOtpRequest = {
    destination: string;
    code: string;
    purpose: "registration";
};

export type TVerifyOtpResponse = {
    success: boolean;
    data: {
        verified: boolean;
        destination: string;
        message: string;
        user: TRegisterResponse["data"]["user"] & {
            sellerProfile: unknown;
        };
        accessToken: string;
        refreshToken: string;
    };
};