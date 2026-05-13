import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Checkout() {

    const { cart, total, clearCart } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function placeOrder() {

        setLoading(true);

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        useEffect(() => {
            console.log("CHECKOUT MOUNTED");
        }, []);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ items })
            });

            const data = await res.json();

            useEffect(() => {
                console.log("CHECKOUT MOUNTED");
            }, []);

            if (!res.ok) {
                throw new Error(data.error || "Order failed");
            }

            clearCart();
            toast.success("Order placed successfully!");

            navigate(`/order-success/${data.orderId}`);

        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Checkout
                </h1>

                {/* Cart Items */}
                <div className="space-y-3 mb-6">

                    {cart.length === 0 ? (
                        <p className="text-gray-500">
                            Your cart is empty.
                        </p>
                    ) : (
                        cart.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b pb-3"
                            >
                                <div className="text-gray-800">
                                    {item.title}
                                </div>

                                <div className="text-gray-600">
                                    × {item.quantity}
                                </div>
                            </div>
                        ))
                    )}

                </div>

                {/* Summary Box */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">

                    <span className="text-lg font-semibold text-gray-700">
                        Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                        €{total.toFixed(2)}
                    </span>

                </div>

                {/* Action Button */}
                <button
                    onClick={placeOrder}
                    disabled={loading || cart.length === 0}
                    className={`
                        w-full py-4 rounded-xl font-semibold text-white transition
                        ${loading || cart.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black hover:bg-gray-800"
                        }
                    `}
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </button>

            </div>

        </div>
    );
}