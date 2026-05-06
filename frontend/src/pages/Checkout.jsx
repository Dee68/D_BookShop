import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Checkout() {
    const { cart, setCart } = useContext(CartContext);

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    async function placeOrder() {
        setLoading(true);

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.qty
        }));

        const res = await fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ items })
        });

        const data = await res.json();

        setLoading(false);

        if (res.ok) {
            alert("Order placed successfully!");

            setCart([]); // clear cart
        } else {
            alert(data.error || "Order failed");
        }
    }

    return (
        <div className="checkout">
            <h2>Checkout</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="checkout-item">
                            <p>{item.title}</p>
                            <p>{item.qty} × €{item.price}</p>
                        </div>
                    ))}

                    <h3>Total: €{total.toFixed(2)}</h3>

                    <button
                        onClick={placeOrder}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                </>
            )}
        </div>
    );
}