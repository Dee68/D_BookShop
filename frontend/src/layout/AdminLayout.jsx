import { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Users from "../pages/Users";
import Categories from "../pages/Categories";
import { AuthContext} from "../auth/AuthContext";

export default function AdminLayout({ onLogout }) {
    const [page, setPage] = useState("dashboard");
    const { logout } = useContext(AuthContext);


    return (
        <div className="admin-layout">
            <Sidebar setPage={setPage} logout={logout} />

            <div className="admin-content">
                {page === "dashboard" && <Dashboard />}
                {page === "products" && <Products />}
                {page === "categories" && <Categories />}
                {page === "orders" && <Orders />}
                {page === "users" && <Users />}
               
            </div>
        </div>
    );
}