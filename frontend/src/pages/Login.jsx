import { useState, useContext } from "react";
import { apiRequest } from "../api/client";
import { AuthContext } from "../auth/AuthContext";

export default function Login({ onLogin }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const res = await apiRequest("/users/login", "POST", {
            email,
            password
        });

        if (res.token) {
            login(res.token);
            onLogin();
        } else {
            alert(res.error || "Login failed");
        }
    }

    return (
        <div className="login-container">
        <form onSubmit={handleLogin} className="login-box">
            <h2>Login</h2>

            <input placeholder="email" onChange={e => setEmail(e.target.value)} />
            <input placeholder="password" type="password" onChange={e => setPassword(e.target.value)} />

            <button>Login</button>
        </form>
        </div>
    );
}