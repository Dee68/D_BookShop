import { useState, useContext } from "react";
import { apiRequest } from "../api/client";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { cardClass } from "../styles/ui";

export default function Login() {

    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const data = await apiRequest("api/users/login", "POST", {
                email,
                password
            });

            if (!data?.token) {
                toast.error(data?.error || "Invalid credentials");
                return;
            }

            login(data.token);
            toast.success("Welcome back!");

            const decoded = jwtDecode(data.token);
            console.log("name", decoded.user.email);

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
        <div className="
            min-h-screen
            flex items-center justify-center
            bg-emerald-50
            dark:bg-zinc-950
            px-4
            transition-colors duration-500
        ">

            {/* CARD */}
            <div className={cardClass}>

                {/* HEADER */}
                <h2 className="
                    text-3xl font-bold text-center mb-6
                    text-gray-900 dark:text-white
                ">
                    Login
                </h2>

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* EMAIL */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="
                            w-full px-4 py-3
                            rounded-xl
                            border border-gray-200 dark:border-zinc-700
                            bg-gray-50 dark:bg-zinc-800
                            text-gray-900 dark:text-white
                            focus:outline-none
                            focus:ring-2 focus:ring-emerald-500
                        "
                    />

                    {/* PASSWORD */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="
                            w-full px-4 py-3
                            rounded-xl
                            border border-gray-200 dark:border-zinc-700
                            bg-gray-50 dark:bg-zinc-800
                            text-gray-900 dark:text-white
                            focus:outline-none
                            focus:ring-2 focus:ring-emerald-500
                        "
                    />

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="
                            w-full
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            py-3
                            rounded-xl
                            font-medium
                            transition
                        "
                    >
                        Login
                    </button>

                </form>

                {/* FOOTER */}
                <p className="
                    text-sm text-center mt-6
                    text-gray-600 dark:text-gray-400
                ">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-emerald-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}