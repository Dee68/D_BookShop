import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

export default function Contacts() {

    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}api/admin/contacts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setMessages(data.data || []))
        .catch(err => console.error(err));
    }, []);

    if (loading) {
         return <Loader text="Loading messages..." />;
    }
    return (
        <div className="p-6 bg-gray-50 dark:bg-zinc-950 min-h-screen transition-colors">

            {/* HEADER */}
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Contact Messages
            </h1>

            {/* TABLE WRAPPER */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">

                <table className="min-w-full text-sm">

                    {/* HEADER */}
                    <thead className="bg-gray-100 dark:bg-zinc-800 text-left">
                        <tr>
                            <th className="p-4 text-gray-700 dark:text-gray-300">Name</th>
                            <th className="p-4 text-gray-700 dark:text-gray-300">Email</th>
                            <th className="p-4 text-gray-700 dark:text-gray-300">Message</th>
                            <th className="p-4 text-gray-700 dark:text-gray-300">Date</th>
                            <th className="p-4 text-gray-700 dark:text-gray-300">Status</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">

                        {messages.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No messages found
                                </td>
                            </tr>
                        ) : (
                            messages.map(msg => (
                                <tr
                                    key={msg.id}
                                    className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                                >

                                    {/* NAME */}
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                                        {msg.name}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {msg.email}
                                    </td>

                                    {/* MESSAGE */}
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        <div className="max-w-xs truncate">
                                            {msg.message}
                                        </div>
                                    </td>

                                    {/* DATE */}
                                    <td className="p-4 text-gray-500 dark:text-gray-400">
                                        {msg.created_at
                                            ? new Date(msg.created_at).toLocaleString()
                                            : "N/A"}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${
                                                    msg.is_read
                                                        ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                                                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                }
                                            `}
                                        >
                                            {msg.is_read ? "Read" : "New"}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>
            </div>
        </div>
    );
}