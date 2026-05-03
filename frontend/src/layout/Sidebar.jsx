import { useContext } from "react";
import { AuthContext} from "../auth/AuthContext";

export default function Sidebar({ setPage, onLogout }) {
    const { logout } = useContext(AuthContext);
    return (
        <div style={{ width: 200, background: "#eee", padding: 10 }}>
            <h3>Admin</h3>

            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={() => setPage("products")}>Products</button>
            <button onClick={()=> setPage("categories")}>Categories</button>
            <button onClick={() => setPage("orders")}>Orders</button>
            <button onClick={() => setPage("users")}>Users</button>

            <hr />

            <button onClick={logout}>Logout</button>
        </div>
    );
}