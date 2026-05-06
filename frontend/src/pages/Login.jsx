import { useState, useContext } from "react";
import { apiRequest } from "../api/client";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function Login() {
    const { login } = useContext(AuthContext); // use this only
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        const data = await apiRequest("/users/login", "POST", {
            email,
            password
        });

        if (!data.token) {
            if (!res.ok) {
                toast.error("Login failed");
                return;
            }

            toast.success("Welcome back!");
        }

        login(data.token); // handles localStorage + state

        const decoded = jwtDecode(data.token);

        if (decoded.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-box">
                <h2>Login</h2>

                <input
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    placeholder="password"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                />

                <button>Login</button>
            </form>
        </div>
    );
}