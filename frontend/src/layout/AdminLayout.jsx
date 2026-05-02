import { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Users from "../pages/Users";

export default function AdminLayout({ onLogout }) {
    const [page, setPage] = useState("dashboard");

    return (
        <div className="admin-layout">
            <Sidebar setPage={setPage} onLogout={onLogout} />

            <div className="admin-content">
                {page === "dashboard" && <Dashboard />}
                {page === "products" && <Products />}
                {page === "orders" && <Orders />}
                {page === "users" && <Users />}
            </div>
        </div>
    );
}