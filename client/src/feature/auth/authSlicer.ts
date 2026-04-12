import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../../type/User'
import {authApi} from "./authApi.ts";

export type AuthState = {
    user: User | null,
    isCheckingAuth: boolean
    isUpdating: boolean
}

const initialState : AuthState = {
    user: null,
    isCheckingAuth: true,
    isUpdating: false
}
export const authSlicer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
         ClearUser : (state) => {
             state.user = null
             state.isCheckingAuth = false
         },
    },
    extraReducers: (builder) => {
        //Me
        builder
            .addMatcher(authApi.endpoints.fetchMe.matchPending, state => {
                state.isCheckingAuth = true;
            })
            .addMatcher(authApi.endpoints.fetchMe.matchFulfilled, (state, action) => {
                state.user = action.payload
                state.isCheckingAuth = false
            })
            .addMatcher(authApi.endpoints.fetchMe.matchRejected, state => {
                state.user = null
                state.isCheckingAuth = false
            })
            //logout
            .addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
                state.user = null
                state.isCheckingAuth = false
                state.isUpdating = false

            })
        //Login
            .addMatcher(authApi.endpoints.login.matchPending, state => {
                state.isCheckingAuth = true;
            })
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload
                state.isCheckingAuth = false
            })
            .addMatcher(authApi.endpoints.login.matchRejected, state => {
                state.user = null
                state.isCheckingAuth = false
            })
        //Register
            .addMatcher(authApi.endpoints.register.matchPending, state => {
                state.isCheckingAuth = true;
            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload
                state.isCheckingAuth = false
            })
            .addMatcher(authApi.endpoints.register.matchRejected, state => {
                state.user = null
                state.isCheckingAuth = false
            })
        //Update
            .addMatcher(authApi.endpoints.update.matchPending, state => {
                state.isUpdating = true;
            })
            .addMatcher(authApi.endpoints.update.matchFulfilled, (state, action) => {
                state.user = action.payload
                state.isUpdating = false
            })
            .addMatcher(authApi.endpoints.update.matchRejected, state => {
                state.isUpdating = false
            })
    }
})

export const { ClearUser } = authSlicer.actions;
export default authSlicer.reducer;