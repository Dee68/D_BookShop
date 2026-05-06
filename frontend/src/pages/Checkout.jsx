import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Checkout() {

    const { cart, total, clearCart } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    async function placeOrder() {

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        try {
            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ items })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Order failed");
            }

            // CLEAR CART
            clearCart();
            toast.success("Order placed successfully!");
            // REDIRECT TO SUCCESS PAGE
            navigate(`/order-success/${data.orderId}`);

        } catch (err) {
           // alert(err.message);
           toast.error(error.message || "Something went wrong");
        }
    }

    return (
        <div className="checkout">

            <h2>Checkout</h2>

            {cart.map(item => (
                <div key={item.id}>
                    {item.title} × {item.quantity}
                </div>
            ))}

            <h3>Total: €{total.toFixed(2)}</h3>

            <button onClick={placeOrder}>
                Place Order
            </button>

        </div>
    );
}