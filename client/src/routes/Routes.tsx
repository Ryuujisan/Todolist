import {createBrowserRouter, Navigate} from "react-router";
import {App} from "../layaut/App.tsx";
import {Dashboard} from "../feature/dashbord/Dashboard.tsx";
import {LoginPage} from "../feature/auth/LoginPage.tsx";
import {ProfilePage} from "../feature/auth/ProfilePage.tsx";
import {RegisterPage} from "../feature/auth/RegisterPage.tsx";
import {AuthGuard} from "../layaut/AuthGuard.tsx";
import {Logout} from "../feature/auth/Logout.tsx";

export const routes = createBrowserRouter([
    {
        element: <App />,
        children : [
          //  {path:"", element: <Navigate to="/login" replace />},
            {path: "/login", element: <LoginPage />},
            {path: "/register", element: <RegisterPage />}
        ]
    },
    {
        element: <AuthGuard />,
        children: [
            {path: "", element: <Navigate to="/dashboard" replace />},
            {path: "/dashboard", element: <Dashboard />},
            {path: "/profile", element: <ProfilePage />},
        ]
    }
])