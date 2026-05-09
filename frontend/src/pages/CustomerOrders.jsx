import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(
                    "http://localhost:3000/api/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "No date";

        return new Date(dateString).toLocaleString("en-IE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    Loading orders...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Orders
                        </h1>

                        <p className="text-gray-500 mt-1">
                            View your recent purchases
                        </p>
                    </div>

                    <div className="bg-white shadow-sm border rounded-xl px-4 py-2">
                        <span className="text-sm text-gray-500">
                            Total Orders
                        </span>

                        <p className="text-xl font-bold text-gray-800">
                            {orders.length}
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
                        <p className="text-lg text-gray-600">
                            No orders yet.
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                            Your orders will appear here after checkout.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() =>
                                    navigate(`/orders/${order.id}`)
                                }
                                className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer p-6"
                            >

                                {/* Top Section */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    {/* Left */}
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                Order #{order.id}
                                            </h2>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 mt-2">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>

                                    {/* Right */}
                                    <div className="text-left md:text-right">
                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(order.total)}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t my-5"></div>

                                {/* Items Preview */}
                                <div className="space-y-2">
                                    {(order.items || []).length > 0 ? (
                                        <>
                                            {order.items
                                                .slice(0, 2)
                                                .map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-gray-700">
                                                            {item.title ||
                                                                "Unknown item"}
                                                        </span>

                                                        <span className="text-gray-500">
                                                            × {item.quantity}
                                                        </span>
                                                    </div>
                                                ))}

                                            {order.items.length > 2 && (
                                                <p className="text-xs text-gray-400 pt-1">
                                                    +
                                                    {order.items.length - 2} more item(s)
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-400 text-sm">
                                            No items
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}