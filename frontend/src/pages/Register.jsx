import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

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

        const res = await fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || "Registration failed");
            return;
        }

        toast.success("Registration successful! Please login.");

        // small delay so user sees toast
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                        <FiUser />
                        <input
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            className="bg-transparent w-full outline-none"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                        <FiMail />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="bg-transparent w-full outline-none"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                        <FiLock />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="bg-transparent w-full outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-zinc-800 transition"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}