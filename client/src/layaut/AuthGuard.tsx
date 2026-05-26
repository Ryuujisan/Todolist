import {useAppSelector} from "../store/store.ts";
import {Navigate} from "react-router";
import {App} from "./App.tsx";

export const AuthGuard = () => {
    const auth = useAppSelector((s) => s.auth);

    if (auth.isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    return (
        auth.user ? <App /> : <Navigate to="/login" replace />
    )
}
