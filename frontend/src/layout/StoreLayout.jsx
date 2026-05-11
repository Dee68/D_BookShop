import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ToggleButton";
import { useEffect } from "react";

export default function StoreLayout() {

    useEffect(()=>{
        document.title = "Store | D-BookShop"
    },[]);

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