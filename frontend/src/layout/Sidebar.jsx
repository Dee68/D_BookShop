import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { NavLink } from "react-router-dom";

import {
    FiHome,
    FiBox,
    FiUsers,
    FiShoppingCart,
    FiFolder,
    FiLogOut,
    FiMenu,
    FiX
} from "react-icons/fi";

export default function Sidebar() {

    const { logout } = useContext(AuthContext);

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [open, setOpen] = useState({
        management: true
    });

    const linkClass = ({ isActive }) =>
        `
        flex items-center gap-3
        px-3 py-2
        rounded-lg
        transition-all duration-200

        ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
    `;

    return (
        <>
            {/* MOBILE MENU BUTTON */}
            <button
                onClick={() => setMobileOpen(true)}
                className="
                    md:hidden
                    fixed top-4 left-4
                    z-50
                    p-2
                    rounded-lg
                    bg-white
                    shadow-md
                    text-black
                "
            >
                <FiMenu size={22} />
            </button>

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="
                        fixed inset-0
                        bg-black/40
                        backdrop-blur-sm
                        z-40
                        md:hidden
                    "
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed md:static
                    top-0 left-0
                    z-50

                    flex flex-col

                    h-screen
                    bg-gray-900
                    text-white

                    transition-all duration-300

                    ${collapsed ? "w-20" : "w-64"}

                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    }
                `}
            >

                {/* HEADER */}
                <div
                    className="
                        flex items-center justify-between
                        p-4
                        border-b border-gray-800
                    "
                >

                    <img
                        src="/images/FullLogo.png"
                        alt="D-BookShop"
                        className={`
                            object-contain
                            transition-all duration-300

                            ${collapsed ? "h-8 w-8" : "h-10 w-auto"}
                        `}
                    />

                    <div className="flex items-center gap-2">

                        {/* DESKTOP COLLAPSE */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="
                                hidden md:flex
                                items-center justify-center
                                text-lg
                                p-1 rounded
                                hover:bg-gray-800
                            "
                        >
                            ☰
                        </button>

                        {/* MOBILE CLOSE */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="
                                md:hidden
                                text-xl
                                p-1 rounded
                                hover:bg-gray-800
                            "
                        >
                            <FiX />
                        </button>

                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 p-3 space-y-2 overflow-y-auto">

                    {/* DASHBOARD */}
                    <NavLink
                        to="/admin"
                        end
                        className={linkClass}
                    >
                        <FiHome size={18} />

                        {!collapsed && <span>Dashboard</span>}
                    </NavLink>

                    {/* MANAGEMENT TOGGLE */}
                    <button
                        onClick={() =>
                            setOpen((prev) => ({
                                ...prev,
                                management: !prev.management
                            }))
                        }
                        className="
                            w-full
                            flex items-center gap-3
                            px-3 py-2
                            rounded-lg
                            text-gray-300
                            hover:bg-gray-800
                            hover:text-white
                            transition-all
                        "
                    >
                        <FiFolder size={18} />

                        {!collapsed && <span>Management</span>}
                    </button>

                    {/* MANAGEMENT LINKS */}
                    {open.management && (
                        <div className="ml-4 space-y-2">

                            <NavLink
                                to="/admin/products"
                                className={linkClass}
                            >
                                <FiBox size={18} />

                                {!collapsed && <span>Products</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/categories"
                                className={linkClass}
                            >
                                <FiFolder size={18} />

                                {!collapsed && <span>Categories</span>}
                            </NavLink>

                        </div>
                    )}

                    {/* USERS */}
                    <NavLink
                        to="/admin/users"
                        className={linkClass}
                    >
                        <FiUsers size={18} />

                        {!collapsed && <span>Users</span>}
                    </NavLink>

                    {/* ORDERS */}
                    <NavLink
                        to="/admin/orders"
                        className={linkClass}
                    >
                        <FiShoppingCart size={18} />

                        {!collapsed && <span>Orders</span>}
                    </NavLink>

                </nav>

                {/* FOOTER / LOGOUT */}
                <div className="p-3 border-t border-gray-800">

                    <button
                        onClick={logout}
                        className="
                            w-full
                            flex items-center justify-center gap-3
                            px-3 py-2
                            rounded-lg

                            bg-red-600
                            hover:bg-red-700

                            transition-all duration-200
                        "
                    >
                        <FiLogOut size={18} />

                        {!collapsed && <span>Logout</span>}
                    </button>

                </div>

            </aside>
        </>
    );
}