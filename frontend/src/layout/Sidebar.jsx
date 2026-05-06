import { useContext, useState } from "react";
import { AuthContext} from "../auth/AuthContext";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiBox,
    FiUsers,
    FiShoppingCart,
    FiFolder,
    FiLogOut
} from "react-icons/fi";

export default function Sidebar({ setPage, onLogout }) {
    const { logout } = useContext(AuthContext);
    const [open, setOpen] = useState({
        management: true
    });
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
       <>
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <button
                className="collapse-btn"
                onClick={() => setCollapsed(!collapsed)}
            >
                ☰
            </button>
                <h2 className="logo">D-BookShop</h2>

            <nav className="nav">
                <NavLink to="/admin" end onClick={() => setMobileOpen(false)}>
                 <FiHome /> {!collapsed && <span>Dashboard</span>}
                </NavLink>
                <div
                    className="section-title"
                    onClick={() =>
                        setOpen({ ...open, management: !open.management })
                    }
                >
                    🛠 Management
                </div>

                 {open.management && (
                    <div className="sub-nav">
                        <NavLink to="/admin/products" onClick={() => setMobileOpen(false)}>
                            <FiBox /> {!collapsed && <span>Products</span>}
                        </NavLink>

                        <NavLink to="/admin/categories" onClick={() => setMobileOpen(false)}>
                            <FiFolder /> {!collapsed && <span>Categories</span>}
                        </NavLink>
                    </div>
                )}
                <NavLink to="/admin/users" onClick={() => setMobileOpen(false)}>
                 <FiUsers /> {!collapsed && <span>Users</span>}
                </NavLink>
                <NavLink to="/admin/orders" onClick={() => setMobileOpen(false)}>
                 <FiShoppingCart /> {!collapsed && <span>Orders</span>}
                </NavLink>
            </nav>

            <button className="logout-btn" onClick={logout}>
                <FiLogOut /> Logout
            </button>
        </div>
        {/* OVERLAY (MOBILE ONLY) */}
        {mobileOpen && (
            <div
                className="overlay"
                onClick={() => setMobileOpen(false)}
            />
        )}
        </>
    );
}