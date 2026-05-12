import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { cardClass } from "../styles/ui";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || "Registration failed");
            return;
        }

        toast.success("Registration successful!");

        setTimeout(() => navigate("/login"), 1000);
    }

    const inputClass =
        "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">

            <div className={cardClass}>

                <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* NAME */}
                    <div className="relative">
                        <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-600 hover:underline">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}