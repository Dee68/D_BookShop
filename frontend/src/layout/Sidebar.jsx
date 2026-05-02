export default function Sidebar({ setPage, onLogout }) {
    return (
        <div style={{ width: 200, background: "#eee", padding: 10 }}>
            <h3>Admin</h3>

            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={() => setPage("products")}>Products</button>
            <button onClick={() => setPage("orders")}>Orders</button>
            <button onClick={() => setPage("users")}>Users</button>

            <hr />

            <button onClick={onLogout}>Logout</button>
        </div>
    );
}