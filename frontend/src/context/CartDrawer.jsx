import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
    const { cart, removeFromCart, updateQty } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <div className={`cart-drawer ${open ? "open" : ""}`}>
            
            <div className="cart-header">
                <h3>Your Cart</h3>
                <button onClick={onClose}>✕</button>
            </div>

            <div className="cart-items">
                {cart.length === 0 ? (
                    <p>Cart is empty</p>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="cart-item">
                            
                            <div>
                                <strong>{item.title}</strong>
                                <p>€{item.price}</p>
                            </div>

                            <div className="qty">
                                <button onClick={() =>
                                    updateQty(item.id, item.qty - 1)
                                }>-</button>

                                <span>{item.qty}</span>

                                <button onClick={() =>
                                    updateQty(item.id, item.qty + 1)
                                }>+</button>
                            </div>

                            <button onClick={() =>
                                removeFromCart(item.id)
                            }>
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-footer">
                <h4>Total: €{total.toFixed(2)}</h4>
                <button className="checkout-btn" onClick={() => {
                        onClose();
                        navigate("/checkout");
                    }}>
                    Checkout
                </button>
            </div>
        </div>
    );
}