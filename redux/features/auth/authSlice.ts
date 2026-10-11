import { RootState } from '@/redux/store'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TUser = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    isSeller: boolean;
    isActive: boolean;
    sellerProfile: unknown | null;
};

export type TAdmin = {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
};

export type TAuthState = {
    token: string | null;
    refreshToken: string | null;
    user: TUser | null;
    admin: TAdmin | null;
};

const initialState: TAuthState = {
    token: null,
    refreshToken: null,
    user: null,
    admin: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: TUser; token: string; refreshToken: string | null }>) => {
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken
            state.user = action.payload.user
            state.admin = null
        },
        adminLogin: (state, action: PayloadAction<{ admin: TAdmin; token: string }>) => {
            state.token = action.payload.token
            state.refreshToken = null
            state.user = null
            state.admin = action.payload.admin
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.admin = null
        },
        setUser: (state, action: PayloadAction<TUser>) => {
            state.user = action.payload
        },
    },
})

export const { login, adminLogin, logout, setUser } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectToken = (state: RootState) => state.auth.token
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer