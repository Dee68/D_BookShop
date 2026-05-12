import { useEffect, useState } from "react";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    const token = localStorage.getItem("token");

    const statusFlow = {
        pending: ["pending", "shipped"],
        shipped: ["shipped", "delivered", "cancelled"],
        delivered: ["delivered"],
        cancelled: ["cancelled"]
    };

    async function loadOrders() {

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        setOrders(data);
    }

    useEffect(() => {
        loadOrders();
    }, []);

    async function updateStatus(id, status) {

        await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            }
        );

        loadOrders();
    }

    function formatDate(dateString) {

        if (!dateString) return "No date";

        return new Date(dateString).toLocaleString(
            "en-IE",
            {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    function getStatusClass(status) {

        switch (status) {

            case "pending":
                return `
                    bg-yellow-100 text-yellow-700
                    dark:bg-yellow-900/30 dark:text-yellow-300
                `;

            case "shipped":
                return `
                    bg-blue-100 text-blue-700
                    dark:bg-blue-900/30 dark:text-blue-300
                `;

            case "delivered":
                return `
                    bg-green-100 text-green-700
                    dark:bg-green-900/30 dark:text-green-300
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
    }

    return (

        <div className="
            min-h-screen
            bg-emerald-50 dark:bg-zinc-950
            p-6
            transition-colors duration-500
        ">

            {/* PAGE HEADER */}
            <div className="mb-8">

                <h1 className="
                    text-3xl font-bold
                    text-gray-900 dark:text-white
                ">
                    Orders
                </h1>

                <p className="
                    mt-2
                    text-gray-600 dark:text-gray-400
                ">
                    Manage and track customer orders
                </p>

            </div>

            {/* ORDERS LIST */}
            <div className="space-y-6">

                {orders.map(order => (

                    <div
                        key={order.id}
                        className="
                            bg-white dark:bg-zinc-900
                            border border-emerald-100 dark:border-zinc-800
                            rounded-3xl
                            shadow-lg
                            hover:shadow-2xl
                            transition-all duration-300
                            overflow-hidden
                        "
                    >

                        {/* HEADER */}
                        <div className="
                            flex flex-col md:flex-row
                            md:items-center md:justify-between
                            gap-4
                            border-b border-emerald-100 dark:border-zinc-800
                            px-6 py-5
                        ">

                            <div>

                                <h2 className="
                                    text-xl font-bold
                                    text-gray-900 dark:text-white
                                ">
                                    Order #{order.id}
                                </h2>

                                <p className="
                                    text-sm
                                    text-gray-500 dark:text-gray-400
                                    mt-1
                                ">
                                    {formatDate(order.created_at)}
                                </p>

                            </div>

                            <span
                                className={`
                                    px-4 py-2
                                    rounded-full
                                    text-sm font-semibold
                                    capitalize
                                    w-fit
                                    ${getStatusClass(order.status)}
                                `}
                            >
                                {order.status}
                            </span>

                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-6">

                            {/* CUSTOMER */}
                            <div>

                                <h3 className="
                                    text-sm font-semibold uppercase tracking-wide
                                    text-gray-500 dark:text-gray-400
                                    mb-2
                                ">
                                    Customer
                                </h3>

                                <div className="
                                    bg-emerald-50 dark:bg-zinc-800/50
                                    border border-emerald-100 dark:border-zinc-700
                                    rounded-2xl
                                    p-4
                                ">

                                    <p className="
                                        font-semibold
                                        text-gray-900 dark:text-white
                                    ">
                                        {order.user?.name || "Unknown User"}
                                    </p>

                                    <p className="
                                        text-sm
                                        text-gray-600 dark:text-gray-400
                                    ">
                                        {order.user?.email || "No Email"}
                                    </p>

                                </div>

                            </div>

                            {/* ITEMS */}
                            <div>

                                <h3 className="
                                    text-sm font-semibold uppercase tracking-wide
                                    text-gray-500 dark:text-gray-400
                                    mb-3
                                ">
                                    Items
                                </h3>

                                <div className="space-y-3">

                                    {(order.items || []).map((item, i) => (

                                        <div
                                            key={i}
                                            className="
                                                flex items-center justify-between
                                                gap-4
                                                bg-gray-50 dark:bg-zinc-800/50
                                                border border-gray-100 dark:border-zinc-700
                                                rounded-2xl
                                                p-4
                                            "
                                        >

                                            <div>

                                                <p className="
                                                    font-medium
                                                    text-gray-900 dark:text-white
                                                ">
                                                    {item.title}
                                                </p>

                                                <p className="
                                                    text-sm
                                                    text-gray-500 dark:text-gray-400
                                                ">
                                                    Qty: {item.quantity}
                                                </p>

                                            </div>

                                            <div className="
                                                font-semibold
                                                text-emerald-700 dark:text-emerald-400
                                            ">
                                                {
                                                    Number(item.price).toLocaleString(
                                                        "en-IE",
                                                        {
                                                            style: "currency",
                                                            currency: "EUR"
                                                        }
                                                    )
                                                }
                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="
                                flex flex-col md:flex-row
                                md:items-center md:justify-between
                                gap-4
                                pt-4
                                border-t border-emerald-100 dark:border-zinc-800
                            ">

                                <div>

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
                                        {
                                            Number(order.total).toLocaleString(
                                                "en-IE",
                                                {
                                                    style: "currency",
                                                    currency: "EUR"
                                                }
                                            )
                                        }
                                    </p>

                                </div>

                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        updateStatus(order.id, e.target.value)
                                    }
                                    className="
                                        px-4 py-3
                                        rounded-xl
                                        border border-emerald-200 dark:border-zinc-700
                                        bg-white dark:bg-zinc-800
                                        text-gray-900 dark:text-white
                                        focus:outline-none
                                        focus:ring-2 focus:ring-emerald-500
                                    "
                                >

                                    {(statusFlow[order.status] || []).map(status => (

                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}