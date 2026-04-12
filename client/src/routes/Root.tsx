import {RouterProvider} from "react-router/dom";
import {routes} from "./Routes.tsx";
import {useFetchMeQuery} from "../feature/auth/authApi.ts";
import {useAppSelector} from "../store/store.ts";
export const Root = () => {
    useFetchMeQuery();

    const auth = useAppSelector((s) => s.auth);

    if (auth.isCheckingAuth) {
        console.log("Checking auth " + auth.isCheckingAuth);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    console.log("Checking auth " + auth.isCheckingAuth + " " + auth.user);
    return <RouterProvider router={routes} />;
};
