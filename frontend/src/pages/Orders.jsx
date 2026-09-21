import { useEffect, useState } from "react";
import {
    FiChevronLeft,
FiChevronRight
} from "react-icons/fi";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    const token = localStorage.getItem("token");
    const [page, setPage] = useState(1);
    const [limit] = useState(3);

    const statusFlow = {
        pending:   ["shipped", "cancelled"],
        shipped:   ["delivered", "cancelled"],
        delivered: [],              // cannot be cancelled
        cancelled: []
    };
    const [updatingId, setUpdatingId] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 3,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(true);

   


    
    async function loadOrders() {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/orders?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            //console.log("ADMIN ORDERS RESPONSE:", data);

            if (!res.ok) {
                console.error("LOAD ORDERS ERROR:", data);

                setOrders([]);
                return;
            }

            setOrders(data.data || []);
            setPagination(data);

        } catch (error) {

            //console.error("LOAD ORDERS FETCH ERROR:", error);
            toast.error(error.message || "Loading Orders error!")

            setOrders([]);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        
        loadOrders();
    }, [page,limit]);

    useEffect(() => {
        if (pagination.totalPages && page > pagination.totalPages) {
            setPage(pagination.totalPages);
        }
    }, [pagination.totalPages]);

    async function updateStatus(id, status) {
    // guard: if this order is already being updated, ignore
    if (updatingId === id) return;

    setUpdatingId(id);

    try {
        const isCancel = status === "cancelled";
        const url = isCancel
            ? `${import.meta.env.VITE_API_URL}/api/admin/orders/${id}/cancel`
            : `${import.meta.env.VITE_API_URL}/api/admin/orders/${id}/status`;

        const res = await fetch(url, {
            method: isCancel ? "POST" : "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: isCancel ? undefined : JSON.stringify({ status })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("UPDATE STATUS ERROR:", data);
            toast.error("Failed to update order status");;
            return;
        }
        toast.success("Order status updated successfully!");
        await loadOrders();

    } catch (error) {
        //console.error("UPDATE STATUS FETCH ERROR:", error);
        
        toast.error(error.message || "UPDATE STATUS FETCH ERROR");
    } finally {
        setUpdatingId(null);
    }
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

    if (loading) {
        return <Loader text="Loading orders..." />;
    }

    return (
        <>
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

                              {statusFlow[order.status]?.length ? (

    <select
        value={order.status}
        disabled={updatingId === order.id}
        onChange={(e) => updateStatus(order.id, e.target.value)}
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
        <option value={order.status} disabled>
            {order.status} (current)
        </option>
        {statusFlow[order.status].map(status => (
            <option key={status} value={status}>
                {status}
            </option>
        ))}
    </select>

) : (

    <span className="
        px-4 py-3
        text-sm font-medium
        text-gray-500 dark:text-gray-400
    ">
        No actions available
    </span>

)}
                            </div>

                        </div>

                    </div>

                ))}

            </div>
                        
        </div>
         {/* PAGINATION */}
            <div className="flex items-center justify-center gap-4">
            
                            {/* PREV */}
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                className="
                                    flex items-center gap-1
                                    px-4 py-2
                                    rounded-xl
                                    bg-gray-200
                                    bg-emerald-700
                                    hover:bg-emerald-800
                                    dark:bg-emerald-600
                                    dark:hover:bg-emerald-500
                                    text-white
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                <FiChevronLeft />
                                Prev
                            </button>
            
                            {/* PAGE */}
                            <div
                                className="
                                    px-4 py-2
                                    rounded-xl
                                    text-gray-700 dark:text-white font-medium
                                "
                            >
                                Page {page}
                            </div>
            
                            {/* NEXT */}
                            <button
                                disabled={page >= (pagination.totalPages || 1)}
                                onClick={() => {
                                    if (page < pagination.totalPages) {
                                        setPage(prev => prev + 1);
                                        }
                                }}
                                className="
                                    flex items-center gap-1
                                    px-4 py-2
                                    rounded-xl
                                    bg-gray-200
                                    bg-emerald-700
                                    hover:bg-emerald-800
                                    dark:bg-emerald-600
                                    dark:hover:bg-emerald-500
                                    text-white
                                    disabled:opacity-50
                                    transition
                                "
                            >
                                Next
                                <FiChevronRight />
                            </button>
            
            </div>
        </>
        
    );
}