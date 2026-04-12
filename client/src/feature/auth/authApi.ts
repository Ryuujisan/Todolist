import {createApi} from "@reduxjs/toolkit/query/react";
import {customBaseQuery} from "../../api/baseApi.ts";
import type {AuthData, User} from "../../type/User.ts";
import {ClearUser} from "./authSlicer.ts";
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customBaseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        fetchMe : builder.query<User, void>({
            query: () => 'auth/me',
            providesTags: ['User']
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(ClearUser());

                    dispatch(
                        authApi.util.invalidateTags(["User"])
                    );
                } catch (error) {
                    console.error(error);
                }
            },
            invalidatesTags: ["User"],
        }),
        login: builder.mutation<User, AuthData>({
            query: (authData) => ({
                url: "auth/login",
                method: "POST",
                body: authData,
            }),

            async onQueryStarted(_authData, { dispatch, queryFulfilled }) {
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(authApi.util.upsertQueryData("fetchMe", undefined, user));
                } catch (error) {
                    console.error(error);
                }
            },
        }),
        register: builder.mutation<User, AuthData>({
            query: (authData) => ({
                url: "auth/register",
                method: "POST",
                body: authData
            }),
            async onQueryStarted(_authData, {dispatch, queryFulfilled}) {
                try {
                    const {data: user} = await queryFulfilled;
                    dispatch(authApi.util.upsertQueryData("fetchMe", undefined, user));
                } catch (error) {
                    
                }
            }
        }),
        update: builder.mutation<User, {password: string, description: string}>({
            query:({password, description}) => ({
                url: "auth/update",
                method: "PUT",
                body: {password, description}
            }),
            async onQueryStarted(_authData, {dispatch, queryFulfilled}) {
                try {
                    const {data: user} = await queryFulfilled;
                    dispatch(authApi.util.upsertQueryData("fetchMe", undefined, user));
                } catch (error) {

                }
            }
        })
    }),
});

export const {useFetchMeQuery, useLogoutMutation, useLoginMutation, useRegisterMutation, useUpdateMutation} = authApi