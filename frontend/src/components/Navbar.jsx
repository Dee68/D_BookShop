import { Link } from "react-router-dom";
import { useContext,useState } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../context/CartDrawer";

export default function Navbar() {
    const { cart } = useContext(CartContext);
     const [open, setOpen] = useState(false);

    return (
        <>
        <nav className="navbar">
            <div className="logo">📚 D-BookShop</div>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>

                {/* <Link to="/cart">
                    Cart ({cart?.length || 0})
                </Link> */}
                <div className="nav-links">
                    <button onClick={() => setOpen(true)}>
                        🛒 Cart
                    </button>
                </div>
            </div>
        </nav>
        <CartDrawer
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}