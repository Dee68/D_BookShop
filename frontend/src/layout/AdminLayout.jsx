import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import { Navigate } from "react-router-dom";
import { AuthContext} from "../auth/AuthContext";
import { Routes, Route } from "react-router-dom";



export default function AdminLayout({ onLogout }) {
    const [page, setPage] = useState("dashboard");
    const { logout } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }


    return (
        <div className="admin-layout">
            <div className="topbar">
             {/* <button className="hamburger" onClick={() => setMobileOpen(true)}>
                ☰
            </button> */}
            </div>
            <Sidebar collapsed={collapsed}
                     setCollapsed={setCollapsed}
                     mobileOpen={mobileOpen}
                     setMobileOpen={setMobileOpen}
                     logout={logout} />

            <div className="admin-content">
                {/* <Routes>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/categories" element={<Categories />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/orders" element={<Orders />} />
                </Routes> */}
                <Outlet />
               
            </div>
        </div>
    );
}