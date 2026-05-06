import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";

export default function CustomerOrders() {

    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/api/orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setOrders(Array.isArray(data) ? data : []));
    }, []);

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
            <h2>My Orders</h2>

            {orders.length === 0 && <p>No orders yet.</p>}

            {orders.map(order => (
                <div
                    key={order.id}
                    className="order-card"
                    onClick={() => navigate(`/orders/${order.id}`)}
                >
                    <div className="order-header">
                        <span>Order #{order.id}</span>
                        <span className={`order-status status-${order.status}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="order-date">
                        {formatDate(order.created_at)}
                    </div>
                     <div className="order-items-preview">
                        {(order.items || []).length > 0 ? (
                            order.items.slice(0, 2).map((item, i) => (
                                <p key={i}>
                                    {item.title || "Unknown item"} × {item.quantity}
                                </p>
                            ))
                        ) : (
                            <p>No items</p>
                        )}
                    </div>

                    <div className="order-total">
                        €{Number(order.total).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
}