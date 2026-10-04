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

export type TAuthState = {
    token: string | null;
    refreshToken: string | null;
    user: TUser | null;
};

const initialState: TAuthState = {
    token: null,
    refreshToken: null,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<Omit<TAuthState, 'token'> & { token: string }>) => {
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken
            state.user = action.payload.user
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
        },
        setUser: (state, action: PayloadAction<TUser>) => {
            state.user = action.payload
        },
    },
})

export const { login, logout, setUser } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectToken = (state: RootState) => state.auth.token
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer