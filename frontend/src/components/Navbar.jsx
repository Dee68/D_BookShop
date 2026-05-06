import { Link } from "react-router-dom";
import { useContext,useState } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../context/CartDrawer";
import { jwtDecode } from "jwt-decode";


export default function Navbar() {
    const { cart } = useContext(CartContext);
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem("token");
    let role = null;

    if (token) {
        const decoded = jwtDecode(token);
        role = decoded.role;
    }

    return (
        <>
            <nav className="navbar">
                <button className="hamburger">☰</button>
                {/* LOGO (CLICKABLE HOME) */}
                <div className="logo">
                    <Link to="/">
                        <img
                            src="/images/FullLogo.png"
                            alt="D-BookShop"
                            className="logo-img"
                        />
                    </Link>
                </div>
                <div className="nav-actions">

                    {/* CART BUTTON (WITH COUNT BADGE) */}
                    <button className="cart-btn" onClick={() => setOpen(true)}>
                        🛒 Cart
                        <span className="cart-count">
                            {cart?.length || 0}
                        </span>
                    </button>

                    {/* LOGIN */}
                    <Link to="/login" className="nav-btn">
                        Login
                    </Link>
                    {token && role !== "admin" && (
                        <Link to="/my-orders" className="nav-btn">
                            My Orders
                        </Link>
                    )}

                </div>
            </nav>

            {/* CART DRAWER */}
            <CartDrawer
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}