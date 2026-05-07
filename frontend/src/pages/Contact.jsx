import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

    const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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

    // RESET FORM
    setForm({
        name: "",
        email: "",
        message: ""
    });

    // REDIRECT HOME
    setTimeout(() => {
        navigate("/");
    }, 1200);
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
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-xl p-6 space-y-4"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    required
                />

                <textarea
                    name="message"
                    placeholder="Your message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg h-32"
                    required
                />

                <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
}