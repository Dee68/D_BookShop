import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function CartDrawer({ open, onClose }) {

    const { cart, increase, decrease, removeFromCart, total } = useContext(CartContext);

    if (!open) return null;

    return (
        <>
        <div className="drawer-overlay" onClick={onClose}></div>
        
            <div className="drawer" onClick={e => e.stopPropagation()}>

                <h2>Your Cart</h2>

                {cart.length === 0 && <p>Cart is empty</p>}

                {cart.map(item => (
                    <div key={item.id} className="cart-item">

                        <img
                            src={`http://localhost:3000${item.images?.[0]}`}
                            alt={item.title}
                        />

                        <div className="cart-info">
                            <p>{item.title}</p>

                            <div className="qty-controls">
                                <button onClick={() => decrease(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increase(item.id)}>+</button>
                            </div>

                            <p>€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <button onClick={() => removeFromCart(item.id)}>
                            ✖
                        </button>

                    </div>
                ))}

                <h3>Total: €{total.toFixed(2)}</h3>

                <button className="checkout-btn" onClick={() => window.location.href = "/checkout"}>
                    Checkout
                </button>

            </div>
        
        </>
    );
}