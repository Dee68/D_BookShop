import { useState, useContext } from "react";
import { apiRequest } from "../api/client";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const data = await apiRequest("/users/login", "POST", {
                email,
                password
            });

            if (!data?.token) {
                toast.error(data?.message || "Invalid credentials");
                return;
            }

            toast.success("Welcome back!");

            login(data.token);

            const decoded = jwtDecode(data.token);

            setTimeout(() => {
                decoded.role === "admin"
                    ? navigate("/admin")
                    : navigate("/");
            }, 600);

        } catch (err) {
            toast.error("Server error. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* HEADER */}
                <h2 className="text-3xl font-bold text-center mb-6">
                    Login
                </h2>

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-5">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-zinc-800 transition"
                    >
                        Login
                    </button>

                </form>

                {/* FOOTER */}
                <p className="text-sm text-center mt-6 text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}