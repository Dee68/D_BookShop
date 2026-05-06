import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../context/CartDrawer";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
    const { cart } = useContext(CartContext);

    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("token");
    let role = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.role;
        } catch (err) {
            console.error("Invalid token");
        }
    }

    return (
        <>
            <nav className="navbar">

                {/* HAMBURGER */}
                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(true)}
                >
                    ☰
                </button>

                {/* LOGO */}
                <Link to="/" className="logo">
                    <img
                        src="/images/FullLogo.png"
                        alt="D-BookShop"
                        className="logo-img"
                    />
                </Link>

                {/* DESKTOP ACTIONS */}
                <div className="nav-actions">

                    {/* CART */}
                    <button
                        className="cart-btn"
                        onClick={() => setCartOpen(true)}
                    >
                        🛒
                        <span className="cart-count">
                            {cart?.length || 0}
                        </span>
                    </button>

                    {/* LOGIN */}
                    {!token && (
                        <Link to="/login" className="nav-btn">
                            Login
                        </Link>
                    )}

                    {/* CUSTOMER */}
                    {token && role !== "admin" && (
                        <Link to="/my-orders" className="nav-btn">
                            My Orders
                        </Link>
                    )}

                    {/* ADMIN */}
                    {token && role === "admin" && (
                        <Link to="/admin" className="nav-btn">
                            Dashboard
                        </Link>
                    )}

                </div>
            </nav>

            {/* 🔥 MOBILE DRAWER */}
          {/* OVERLAY */}
            <div
                className={`mobile-overlay ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* DRAWER */}
            <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>

                <button
                    className="close-btn"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                <Link to="/" onClick={() => setMenuOpen(false)}>
                    Home
                </Link>

                {!token && (
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                        Login
                    </Link>
                )}

                {token && role !== "admin" && (
                    <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                        My Orders
                    </Link>
                )}

                {token && role === "admin" && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}>
                        Dashboard
                    </Link>
                )}

                <button
                    onClick={() => {
                        setCartOpen(true);
                        setMenuOpen(false);
                    }}
                >
                    🛒 Cart ({cart.length})
                </button>

            </div>

            {/* CART DRAWER */}
            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
            />
        </>
    );
}