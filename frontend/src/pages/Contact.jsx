import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { cardClass } from "../styles/ui";

export default function Contact() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        let data;
        try {
            data = await res.json();
        } catch {
            toast.error("Server error");
            return;
        }

        if (!res.ok) {
            toast.error(data.message || "Failed to deliver message");
            return;
        }

        toast.success(
            `Message received successfully on ${formatDate(data.receivedAt)}`
        );

        setForm({ name: "", email: "", message: "" });

        setTimeout(() => navigate("/"), 1200);
    }

    function formatDate(dateString) {
        if (!dateString) return "No date";
        return new Date(dateString).toLocaleString("en-IE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Contact Us
            </h1>

            {/* FORM CARD */}
            <form
                onSubmit={handleSubmit}
                className="
                    bg-white dark:bg-zinc-900
                    border border-gray-100 dark:border-zinc-800
                    shadow-sm
                    rounded-2xl
                    p-6
                    space-y-4
                "
            >

                {/* NAME */}
                <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="
                        w-full p-3
                        rounded-xl
                        border border-gray-200 dark:border-zinc-700
                        bg-gray-50 dark:bg-zinc-800
                        text-gray-900 dark:text-white
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                    "
                />

                {/* EMAIL */}
                <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="
                        w-full p-3
                        rounded-xl
                        border border-gray-200 dark:border-zinc-700
                        bg-gray-50 dark:bg-zinc-800
                        text-gray-900 dark:text-white
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                    "
                />

                {/* MESSAGE */}
                <textarea
                    name="message"
                    placeholder="Your message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="
                        w-full p-3
                        rounded-xl
                        border border-gray-200 dark:border-zinc-700
                        bg-gray-50 dark:bg-zinc-800
                        text-gray-900 dark:text-white
                        h-32
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
                        font-medium
                        py-3
                        rounded-xl
                        transition
                    "
                >
                    Send Message
                </button>

            </form>

        </div>
    );
}