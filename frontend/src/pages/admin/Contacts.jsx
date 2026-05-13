import { useEffect, useState } from "react";

export default function Contacts() {

    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");

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

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Contact Messages
            </h1>

            <div className="overflow-x-auto bg-white shadow rounded-lg">

                <table className="min-w-full text-sm">

                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Message</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No messages found
                                </td>
                            </tr>
                        ) : (
                            messages.map(msg => (
                                <tr key={msg.id} className="border-t hover:bg-gray-50">

                                    <td className="p-3 font-medium">
                                        {msg.name}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {msg.email}
                                    </td>

                                    <td className="p-3 text-gray-700">
                                        {msg.message}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {msg.created_at
                                        ? new Date(msg.created_at).toLocaleString()
                                        : "N/A"}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            msg.is_read
                                                ? "bg-gray-200 text-gray-700"
                                                : "bg-green-100 text-green-700"
                                        }`}>
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