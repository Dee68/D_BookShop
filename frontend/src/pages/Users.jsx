import { useEffect, useState } from "react";
import {
    FiArrowUpCircle,
    FiArrowDownCircle,
    FiTrash2,
    FiUsers
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function Users() {

    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [pagination, setPagination] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);


   //handles delete
    function handleDeleteClick(id) {
        setConfirmDelete(id);
    }

    async function loadUsers() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}api/users?page=${page}&limit=${limit}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const data = await res.json();
        setUsers(data.data || []);
        setPagination(data.pagination || {});
    }

    useEffect(() => {
        loadUsers();
    }, [page]);

    useEffect(() => {
        if (pagination.pages && page > pagination.pages) {
            setPage(pagination.pages);
        }
    }, [pagination.pages]);

    async function changeRole(id, role) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        });

        toast.success("User role updated successfully.");
        loadUsers();
    }

    async function deleteUser(id) {
        setDeleting(true);

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("User deleted successfully.");
            loadUsers();
            setConfirmDelete(null);

        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <FiUsers size={18} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Users
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Manage D-BookShop users and permissions
                        </p>
                    </div>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full text-sm">

                        {/* HEADER */}
                        <thead className="bg-emerald-700 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">

                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-emerald-50 dark:hover:bg-zinc-800 transition"
                                >

                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                        #{user.id}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {user.name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {user.email}
                                    </td>

                                    {/* ROLE */}
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${user.role === "admin"
                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
                                            }
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4">

                                        <div className="flex gap-2">

                                            {user.role !== "admin" ? (
                                                <button
                                                    onClick={() => changeRole(user.id, "admin")}
                                                    className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                                >
                                                    <FiArrowUpCircle size={14} />
                                                    Promote
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => changeRole(user.id, "customer")}
                                                    className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                                >
                                                    <FiArrowDownCircle size={14} />
                                                    Demote
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDeleteClick(user.id)}
                                                className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                            >
                                                <FiTrash2 size={14} />
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

                {/* Modal */}
                {confirmDelete && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl w-full max-w-md">

                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Confirm Deletion
                                        </h3>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                        Are you sure you want to delete this user? This action cannot be undone and will permanently remove their account and data.
                                        </p>
                                        
                                        <div className="flex justify-end gap-3">

                                            <button
                                                onClick={() => setConfirmDelete(null)}
                                                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={() => deleteUser(confirmDelete)}
                                                className={`
                                                        px-4 py-2 rounded-lg text-white transition
                                                        ${deleting
                                                            ? "bg-red-400 cursor-not-allowed"
                                                            : "bg-red-600 hover:bg-red-700"
                                                        }
                                                    `}
                                                    disabled={deleting}
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>
                )}

                {/* PAGINATION */}
                <div className="flex items-center justify-center gap-4 py-6">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-white disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium">
                        Page {page}
                    </div>

                    <button
                        disabled={page >= (pagination.pages || 1)}
                        onClick={() => setPage(prev => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-white disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}