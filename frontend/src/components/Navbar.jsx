import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FiShoppingCart, FiUser, FiLogOut, FiHome } from "react-icons/fi";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../auth/AuthContext";
import CartDrawer from "../context/CartDrawer";

export default function Navbar() {

    const { cart } = useContext(CartContext);
    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    const token = localStorage.getItem("token");

    let role = null;

    if (token) {
        try {
            role = jwtDecode(token).role;
        } catch {
            console.error("Invalid token");
        }
    }

    function handleLogout() {
        logout();

        setMenuOpen(false);
        setCartOpen(false);

        navigate("/login");
    }

    return (
        <>
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 bg-black text-white shadow-md">

                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/images/FullLogo.png"
                            alt="D-BookShop"
                            className="h-12 object-contain"
                        />
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* CUSTOMER */}
                        {token && role !== "admin" && (
                            <Link
                                to="/my-orders"
                                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                            >
                                My Orders
                            </Link>
                        )}

                        {/* ADMIN */}
                        {token && role === "admin" && (
                            <Link
                                to="/admin"
                                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                            >
                                Dashboard
                            </Link>
                        )}

                        <Link
                            to="/contact"
                            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                        >
                            Contact
                        </Link>
                        {/* CART */}
                       <button className="cart-btn" onClick={() => setCartOpen(true)}>
                            <FiShoppingCart size={18} />
                            <span className="cart-count">{cart?.length || 0}</span>
                        </button>

                        {/* LOGIN / LOGOUT */}
                        {!token ? (
                            <>
                            <Link to="/login" className="nav-btn">
                                <FiUser size={16} /> Login
                            </Link>
                            <Link to="/register" className="nav-btn">
                                Register
                            </Link>
                            </>
                        ) : (
                            <button className="nav-btn logout" onClick={handleLogout}>
                                <FiLogOut size={16} /> Logout
                            </button>
                        )}

                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden text-3xl"
                    >
                        ☰
                    </button>

                </div>
            </header>

            {/* MOBILE OVERLAY */}
            <div
                onClick={() => setMenuOpen(false)}
                className={`
                    fixed inset-0 bg-black/40 backdrop-blur-sm z-40
                    transition-opacity duration-300
                    ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
            />

            {/* MOBILE DRAWER */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-72 bg-white z-50
                    shadow-2xl p-6 flex flex-col gap-4
                    transition-transform duration-300
                    ${menuOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >

                {/* CLOSE */}
                <button
                    onClick={() => setMenuOpen(false)}
                    className="self-end text-2xl text-black"
                >
                    ✕
                </button>

                {/* HOME */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                    Home
                </Link>
                <Link
                        to="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        Contact
                </Link>
                {/* CUSTOMER */}
                {token && role !== "admin" && (
                    <Link
                        to="/my-orders"
                        onClick={() => setMenuOpen(false)}
                        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        My Orders
                    </Link>
                )}

                {/* ADMIN */}
                {token && role === "admin" && (
                    <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        Dashboard
                    </Link>
                )}

                {/* CART */}
                <button
                    onClick={() => {
                        setCartOpen(true);
                        setMenuOpen(false);
                    }}
                    className="p-3 rounded-lg bg-yellow-400 text-black font-semibold"
                >
                    <FiShoppingCart size={18} /> Cart ({cart?.length || 0})
                </button>

                {/* LOGIN / LOGOUT */}
                {!token ? (
                    <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="p-3 rounded-lg bg-blue-600 text-white text-center"
                    >
                        Login
                    </Link>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="p-3 rounded-lg bg-red-500 text-white"
                    >
                        Logout
                    </button>
                )}

            </div>

            {/* CART DRAWER */}
            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
            />
        </>
    );
}