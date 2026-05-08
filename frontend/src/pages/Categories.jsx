import { useEffect, useState } from "react";

import {
    FiTag,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiX,
    FiChevronLeft,
FiChevronRight
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function Categories() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [pagination, setPagination] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(null);

    const token = localStorage.getItem("token");

    //handles delete
    function handleDeleteClick(id) {
        setConfirmDelete(id);
    }

    // LOAD
    async function loadCategories() {

        const res = await fetch(`http://localhost:3000/api/categories?page=${page}&limit=${limit}`);
        const data = await res.json();

        //setCategories(data);
        setCategories(data.data || data);
        setPagination(data.pagination || {});
    }
 
    useEffect(() => {
        loadCategories();
    }, [page,limit]);

    useEffect(() => {
        if (pagination.pages && page > pagination.pages) {
            setPage(pagination.pages);
        }
    }, [pagination.pages]);

    // CREATE
    async function createCategory(e) {

        e.preventDefault();

        await fetch("http://localhost:3000/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });
        toast.success("Category created successfully.");
        setName("");
        loadCategories();
    }

    // DELETE
    async function deleteCategory(id) {

        // const confirmDelete = window.confirm(
        //     "Are you sure you want to delete this category?"
        // );

        // if (!confirmDelete) return;

        await fetch(`http://localhost:3000/api/categories/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success("Category deleted successfully.");
        loadCategories();
        setConfirmDelete(null);
    }

    // START EDIT
    function startEdit(cat) {

        setEditingId(cat.id);
        setName(cat.name);
    }

    // UPDATE
    async function updateCategory(e) {

        e.preventDefault();

        await fetch(`http://localhost:3000/api/categories/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        setEditingId(null);
        setName("");

        loadCategories();
    }
 
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Categories
                </h2>

                <p className="text-sm text-gray-500">
                    Manage product categories
                </p>
            </div>

            {/* FORM CARD */}
            <div
                className="
                    bg-white
                    rounded-2xl
                    border border-gray-100
                    shadow-sm
                    p-6
                "
            >

                <div className="flex items-center gap-2 mb-4">

                    <div
                        className="
                            h-10 w-10
                            rounded-xl
                            bg-purple-100
                            text-purple-600
                            flex items-center justify-center
                        "
                    >
                        <FiTag size={18} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {editingId ? "Edit Category" : "Create Category"}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {editingId
                                ? "Update category information"
                                : "Add a new category"}
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <form
                    onSubmit={editingId ? updateCategory : createCategory}
                    className="
                        flex flex-col md:flex-row
                        gap-4
                    "
                >

                    {/* INPUT */}
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category name"
                        className="
                            flex-1
                            px-4 py-3
                            rounded-xl
                            border border-gray-200
                            bg-gray-50
                            focus:outline-none
                            focus:ring-2 focus:ring-purple-500
                            focus:border-transparent
                            transition
                        "
                    />

                    {/* BUTTONS */}
                    <div className="flex gap-2">

                        <button
                            type="submit"
                            className={`
                                flex items-center gap-2
                                px-5 py-3
                                rounded-xl
                                text-white
                                font-medium
                                transition
                                ${editingId
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }
                            `}
                        >
                            {editingId ? (
                                <>
                                    <FiEdit2 size={16} />
                                    Update
                                </>
                            ) : (
                                <>
                                    <FiPlus size={16} />
                                    Add
                                </>
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setName("");
                                }}
                                className="
                                    flex items-center gap-2
                                    px-5 py-3
                                    rounded-xl
                                    bg-gray-200
                                    hover:bg-gray-300
                                    text-gray-700
                                    font-medium
                                    transition
                                "
                            >
                                <FiX size={16} />
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            {/* TABLE CARD */}
            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border border-gray-100
                    overflow-hidden
                "
            >

                <div className="overflow-x-auto">

                    <table className="min-w-full text-sm">

                        {/* TABLE HEADER */}
                        <thead
                            className="
                                bg-gray-900
                                text-white
                                uppercase
                                text-xs
                                tracking-wider
                            "
                        >
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    ID
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Category Name
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody className="divide-y divide-gray-100">

                            {categories.map((cat) => (

                                <tr
                                    key={cat.id}
                                    className="hover:bg-purple-50 transition"
                                >

                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        #{cat.id}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div
                                            className="
                                                inline-flex
                                                items-center gap-2
                                                px-3 py-1
                                                rounded-full
                                                bg-purple-100
                                                text-purple-700
                                                text-xs
                                                font-semibold
                                            "
                                        >
                                            <FiTag size={12} />
                                            {cat.name}
                                        </div>

                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4">

                                        <div className="flex gap-2">

                                            {/* EDIT */}
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="
                                                    flex items-center gap-1
                                                    px-3 py-2
                                                    rounded-lg
                                                    bg-blue-600
                                                    hover:bg-blue-700
                                                    text-white
                                                    text-xs
                                                    font-medium
                                                    transition
                                                "
                                            >
                                                <FiEdit2 size={14} />
                                                Edit
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => handleDeleteClick(cat.id)}
                                                className="
                                                    flex items-center gap-1
                                                    px-3 py-2
                                                    rounded-lg
                                                    bg-red-600
                                                    hover:bg-red-700
                                                    text-white
                                                    text-xs
                                                    font-medium
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

            </div>
            {/* Modal */}
            {confirmDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

                <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">

                    <h3 className="text-lg font-semibold mb-2">
                        Confirm Deletion
                    </h3>

                    <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this category?
                    This action cannot be undone.
                    </p>
                    
                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => deleteCategory(confirmDelete)}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>
)}
            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-4">

                {/* PREV */}
                <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="
                        flex items-center gap-1
                        px-4 py-2
                        rounded-xl
                        bg-gray-200
                        hover:bg-gray-300
                        text-gray-700
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    <FiChevronLeft />
                    Prev
                </button>

                {/* PAGE */}
                <div
                    className="
                        px-4 py-2
                        rounded-xl
                        bg-purple-100
                        text-purple-700
                        font-semibold
                    "
                >
                    Page {page}
                </div>

                {/* NEXT */}
                <button
                    disabled={page >= (pagination.pages || 1)}
                    onClick={() => {
                        if (page < pagination.pages) {
                            setPage(prev => prev + 1);
                            }
                    }}
                    className="
                        flex items-center gap-1
                        px-4 py-2
                        rounded-xl
                        bg-gray-200
                        hover:bg-gray-300
                        text-gray-700
                        transition
                    "
                >
                    Next
                    <FiChevronRight />
                </button>

            </div>
            

        </div>
    );
}