import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/dashboard.css";

export default function Dashboard() {
    const { token } = useContext(AuthContext);

    const statusColors = {
        pending: "#f59e0b",     // orange
        shipped: "#3b82f6",     // blue
        delivered: "#10b981",   // green
        cancelled: "#ef4444"    // red
    };

    function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
    }

    const [data, setData] = useState({
        system: null,
        sales: null,
        orders: []
    });

    useEffect(() => {
        async function load() {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [systemRes, salesRes, ordersRes] = await Promise.all([
                fetch("http://localhost:3000/api/admin/stats/system", { headers }),
                fetch("http://localhost:3000/api/admin/stats/sales", { headers }),
                fetch("http://localhost:3000/api/admin/stats/orders", { headers })
            ]);

            const system = await systemRes.json();
            const sales = await salesRes.json();
            const orders = await ordersRes.json();

            setData({ system, sales, orders });
        }

        load();
    }, [token]);

    if (!data.system || !data.sales) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <h2>Admin Dashboard</h2>

            <div className="grid">
                <Card title="Users" value={data.system.totalUsers} icon="👤" />
                <Card title="Products" value={data.system.totalProducts} icon="📚" />
                <Card title="Revenue" value={`€${data.sales.totalRevenue.toFixed(2)}`} icon="💰" />
                <Card title="Orders" value={data.sales.totalOrders} icon="📦" />
                <Card title="Low Stock" value={data.system.lowStock} icon="⚠️" />
            </div>

            <div className="status-box">
                <h3>Order Status</h3>
                {data.orders.map(o => (
                    <div key={formatStatus(o.status)} className="status-row">
                        <span
                            className="status-badge"
                            style={{ backgroundColor: statusColors[o.status] || "#999" }}
                        >
                            {formatStatus(o.status)}
                        </span>

                        <span className="status-count">{o.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Card({ title, value, icon }) {
    return (
        <div className="card">
            <div className="card-icon">{icon}</div>
            <div>
                <div className="card-title">{title}</div>
                <div className="card-value">{value}</div>
            </div>
        </div>
    );
}