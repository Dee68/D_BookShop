import { useState } from "react";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";

export default function App() {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

    if (!isAuth) {
        return <Login onLogin={() => setIsAuth(true)} />;
    }

    return <AdminLayout onLogout={() => setIsAuth(false)} />;
}