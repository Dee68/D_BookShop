import { useEffect, useState } from "react";
import "../styles/orders.css";
import { useNavigate } from "react-router-dom";


export default function Orders() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const statusFlow = {
        pending: ["pending", "shipped"],
        shipped: ["shipped", "delivered","cancelled"],
        delivered: ["delivered"],
        cancelled: ["cancelled"]
    };

    async function loadOrders() {
        const res = await fetch("http://localhost:3000/api/orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        setOrders(data);
    }

    useEffect(() => {
        loadOrders();
    }, []);

    async function updateStatus(id, status) {
        await fetch(`http://localhost:3000/api/orders/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        loadOrders();
    }

    function formatDate(dateString) {
        if (!dateString) return "No date";
        return new Date(dateString).toLocaleString("en-IE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
    return (
       <div className="orders-container">
    <h2>Orders</h2>

    {orders.map(order => (
        <div key={order.id} className="order-card" >

            {/* HEADER */}
            <div className="order-header">
                <span className="order-id">
                    Order #{order.id}
                </span>

                <span className={`order-status status-${order.status}`}>
                    {order.status}
                </span>
            </div>

            {/* USER */}
            <div className="order-user">
                {order.user?.name || "Unknown User"} 
                ({order.user?.email || "No Email"})
            </div>
            <div className="order-date">
                {formatDate(order.created_at)}
            </div>

            {/* ITEMS */}
            <ul className="order-items">
                {(order.items || []).map((item, i) => (
                    <li key={i}>
                        {item.title} — {item.quantity} × {Number(item.price).toLocaleString("en-IE",{style:"currency",currency:"EUR"})}
                    </li>
                ))}
            </ul>

            {/* FOOTER */}
            <div className="order-footer">

                <div className="order-total">
                    {Number(order.total).toLocaleString("en-IE",{style:"currency",currency:"EUR"})}
                </div>

                <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                   {(statusFlow[order.status] || []).map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

            </div>
        </div>
    ))}
</div>
    );
}