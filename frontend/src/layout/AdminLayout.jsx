import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../auth/AuthContext";
import ThemeToggle from "../components/ToggleButton";

export default function AdminLayout() {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 bg-white dark:bg-zinc-900">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 overflow-x-hidden">
                <ThemeToggle />
                <div className="p-6">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}