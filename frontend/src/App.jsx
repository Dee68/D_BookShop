import { useState, useEffect, useContext } from "react";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import { AuthContext } from "./auth/AuthContext";

export default function App() {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!token) {
        return <Login onLogin={() => {}} />;
    }

    return <AdminLayout />;
}