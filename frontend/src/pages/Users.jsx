import { useEffect, useState } from "react";
import {
    FiArrowUpCircle,
    FiArrowDownCircle,
    FiTrash2
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function Users() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [pagination, setPagination] = useState({});

    async function loadUsers() {
        const res = await fetch(
            `http://localhost:3000/api/users?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();
        //console.log("API RESPONSE:", data);
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
        await fetch(`http://localhost:3000/api/users/${id}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        });
        toast.success("User role changed successfully.");
        loadUsers();
    }

    async function deleteUser(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        loadUsers();
    }
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Users
                </h2>
                <p className="text-gray-500 dark:text-white text-sm">
                    Manage D_BookShop Users and Roles
                </p>
            </div>

            {/* TABLE WRAPPER */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full text-sm">

                        {/* HEADER */}
                        <thead className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">

                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className="
                                        hover:bg-blue-50
                                        transition
                                    "
                                >

                                    <td className="px-6 py-4 text-gray-700">
                                        #{user.id}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {user.name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {user.email}
                                    </td>

                                    {/* ROLE BADGE */}
                                    <td className="px-6 py-4">

                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }
                                            `}
                                        >
                                            {user.role}
                                        </span>

                                    </td>
                                    {/* ACTIONS */}
                                    <td className="px-6 py-4">

                                        <div className="flex gap-2">

                                            {/* PROMOTE */}
                                            {user.role !== "admin" ? (
                                                <button
                                                    onClick={() => changeRole(user.id, "admin")}
                                                    className="
                                                        flex items-center gap-1
                                                        px-3 py-1 text-xs rounded-lg
                                                        bg-blue-600 text-white
                                                        hover:bg-blue-700
                                                        transition
                                                    "
                                                >
                                                    <FiArrowUpCircle size={14} />
                                                    Promote
                                                </button>
                                            ) : (
                                                /* DEMOTE */
                                                <button
                                                    onClick={() => changeRole(user.id, "customer")}
                                                    className="
                                                        flex items-center gap-1
                                                        px-3 py-1 text-xs rounded-lg
                                                        bg-yellow-500 text-white
                                                        hover:bg-yellow-600
                                                        transition
                                                    "
                                                >
                                                    <FiArrowDownCircle size={14} />
                                                    Demote
                                                </button>
                                            )}

                                            {/* DELETE */}
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="
                                                    flex items-center gap-1
                                                    px-3 py-1 text-xs rounded-lg
                                                    bg-red-600 text-white
                                                    hover:bg-red-700
                                                    transition
                                                "
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
                <div className="flex items-center justify-center gap-4 mt-6">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
                            Page {page}
                        </div>

                        <button
                            disabled={page >= (pagination.pages || 1)}
                            onClick={() => {
                                if (page < pagination.pages) {
                                    setPage(prev => prev + 1);
                                }
                            }}
                            className="px-4 py-2 bg-gray-200 rounded-xl"
                        >
                            Next
                        </button>

                </div>
            </div>
        </div>
    );
}