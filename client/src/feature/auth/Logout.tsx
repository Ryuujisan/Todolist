import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useLogoutMutation } from "./authApi";

export const Logout = () => {
    const [logout] = useLogoutMutation();
    const [done, setDone] = useState(false);

    useEffect(() => {
        const runLogout = async () => {
            try {
                await logout().unwrap();
            } finally {
                setDone(true);
            }
        };

        runLogout();
    }, [logout]);

    if (done) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
};