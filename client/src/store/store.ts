import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "../feature/auth/authApi.ts";
import {useDispatch, useSelector} from "react-redux";
import {authSlicer} from "../feature/auth/authSlicer.ts";
import {workspaceApi} from "../feature/dashbord/workspaceApi.ts";

export const store = configureStore({
    reducer : {
        auth: authSlicer.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [workspaceApi.reducerPath]: workspaceApi.reducer,
        
    },
    
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(authApi.middleware,
                workspaceApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()