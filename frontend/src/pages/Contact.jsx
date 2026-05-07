import { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        // For now: just simulate submission
        toast.success("Message sent successfully!");

        setForm({
            name: "",
            email: "",
            message: ""
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