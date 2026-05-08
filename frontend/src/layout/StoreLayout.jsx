import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ToggleButton";

export default function StoreLayout() {

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <Navbar />

            <main className="flex-1 bg-white dark:bg-zinc-900">
                <ThemeToggle />
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}