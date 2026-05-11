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

        return new Date(dateString).toLocaleString(
            "en-IE",
            {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IE",
            {
                style: "currency",
                currency: "EUR",
            }
        ).format(value);
    };

    const getStatusStyles = (status) => {

        switch (status?.toLowerCase()) {

            case "completed":
            case "delivered":
                return `
                    bg-green-100 text-green-700
                    dark:bg-green-900/30 dark:text-green-300
                `;

            case "pending":
                return `
                    bg-yellow-100 text-yellow-700
                    dark:bg-yellow-900/30 dark:text-yellow-300
                `;

            case "cancelled":
                return `
                    bg-red-100 text-red-700
                    dark:bg-red-900/30 dark:text-red-300
                `;

            default:
                return `
                    bg-gray-100 text-gray-700
                    dark:bg-zinc-800 dark:text-gray-300
                `;
        }
    };

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex items-center justify-center
                bg-emerald-50 dark:bg-zinc-950
            ">

                <p className="
                    text-lg
                    text-gray-500 dark:text-gray-400
                ">
                    Loading orders...
                </p>

            </div>
        );
    }

    return (

        <div className="
            min-h-screen
            bg-emerald-50 dark:bg-zinc-950
            py-10 px-4
            transition-colors duration-500
        ">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="
                    flex flex-col md:flex-row
                    md:items-center md:justify-between
                    gap-4
                    mb-8
                ">

                    <div>

                        <h1 className="
                            text-3xl font-bold
                            text-gray-900 dark:text-white
                        ">
                            My Orders
                        </h1>

                        <p className="
                            mt-2
                            text-gray-600 dark:text-gray-400
                        ">
                            View your recent purchases
                        </p>

                    </div>

                    <div className="
                        bg-white dark:bg-zinc-900
                        border border-emerald-100 dark:border-zinc-800
                        rounded-2xl
                        shadow-md
                        px-5 py-3
                    ">

                        <span className="
                            text-sm
                            text-gray-500 dark:text-gray-400
                        ">
                            Total Orders
                        </span>

                        <p className="
                            text-2xl font-bold
                            text-emerald-700 dark:text-emerald-400
                        ">
                            {orders.length}
                        </p>

                    </div>

                </div>

                {/* EMPTY STATE */}
                {orders.length === 0 ? (

                    <div className="
                        bg-white dark:bg-zinc-900
                        border border-emerald-100 dark:border-zinc-800
                        rounded-3xl
                        shadow-lg
                        p-12
                        text-center
                    ">

                        <p className="
                            text-lg
                            text-gray-700 dark:text-gray-300
                        ">
                            No orders yet.
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            text-gray-500 dark:text-gray-400
                        ">
                            Your orders will appear here after checkout.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {orders.map((order) => (

                            <div
                                key={order.id}
                                onClick={() =>
                                    navigate(`/orders/${order.id}`)
                                }
                                className="
                                    bg-white dark:bg-zinc-900
                                    border border-emerald-100 dark:border-zinc-800
                                    rounded-3xl
                                    shadow-md
                                    hover:shadow-2xl
                                    hover:-translate-y-1
                                    transition-all duration-300
                                    cursor-pointer
                                    p-6
                                "
                            >

                                {/* TOP */}
                                <div className="
                                    flex flex-col md:flex-row
                                    md:items-center md:justify-between
                                    gap-5
                                ">

                                    {/* LEFT */}
                                    <div>

                                        <div className="
                                            flex items-center gap-3 flex-wrap
                                        ">

                                            <h2 className="
                                                text-xl font-bold
                                                text-gray-900 dark:text-white
                                            ">
                                                Order #{order.id}
                                            </h2>

                                            <span
                                                className={`
                                                    px-3 py-1
                                                    rounded-full
                                                    text-xs font-semibold
                                                    capitalize
                                                    ${getStatusStyles(order.status)}
                                                `}
                                            >
                                                {order.status}
                                            </span>

                                        </div>

                                        <p className="
                                            text-sm
                                            text-gray-500 dark:text-gray-400
                                            mt-2
                                        ">
                                            {formatDate(order.created_at)}
                                        </p>

                                    </div>

                                    {/* RIGHT */}
                                    <div className="
                                        text-left md:text-right
                                    ">

                                        <p className="
                                            text-sm
                                            text-gray-500 dark:text-gray-400
                                        ">
                                            Total
                                        </p>

                                        <p className="
                                            text-2xl font-bold
                                            text-emerald-700 dark:text-emerald-400
                                        ">
                                            {formatCurrency(order.total)}
                                        </p>

                                    </div>

                                </div>

                                {/* DIVIDER */}
                                <div className="
                                    border-t
                                    border-emerald-100 dark:border-zinc-800
                                    my-5
                                " />

                                {/* ITEMS */}
                                <div className="space-y-3">

                                    {(order.items || []).length > 0 ? (

                                        <>
                                            {order.items
                                                .slice(0, 2)
                                                .map((item, i) => (

                                                    <div
                                                        key={i}
                                                        className="
                                                            flex items-center justify-between
                                                            bg-emerald-50 dark:bg-zinc-800/50
                                                            border border-emerald-100 dark:border-zinc-700
                                                            rounded-2xl
                                                            px-4 py-3
                                                        "
                                                    >

                                                        <span className="
                                                            text-gray-800 dark:text-gray-200
                                                            font-medium
                                                        ">
                                                            {item.title || "Unknown item"}
                                                        </span>

                                                        <span className="
                                                            text-sm
                                                            text-gray-500 dark:text-gray-400
                                                        ">
                                                            × {item.quantity}
                                                        </span>

                                                    </div>

                                                ))}

                                            {order.items.length > 2 && (

                                                <p className="
                                                    text-xs
                                                    text-gray-500 dark:text-gray-400
                                                    pt-1
                                                ">
                                                    +{order.items.length - 2} more item(s)
                                                </p>

                                            )}

                                        </>

                                    ) : (

                                        <p className="
                                            text-sm
                                            text-gray-500 dark:text-gray-400
                                        ">
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