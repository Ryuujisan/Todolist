import {Outlet} from "react-router";
import {NavBar} from "./NavBar.tsx";

export const App = () => {

    return (
        <>
            <NavBar />
            <main className="min-h-screen bg-base-200">
                <div className="mx-auto w-full max-w-7xl px-4 py-8">
                    <Outlet />
                </div>
            </main>
        </>
    )
}
