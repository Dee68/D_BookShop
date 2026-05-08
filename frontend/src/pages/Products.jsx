import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import ProductForm from "../components/ProductForm";

import {
    FiTrash2,
    FiEdit2,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiPackage
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [pagination, setPagination] = useState({});
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalPages = pagination.totalPages || 1;
    const [confirmDelete, setConfirmDelete] = useState(null);

    const token = localStorage.getItem("token");

    async function fetchProducts() {
        const data = await apiRequest(
            `/products?search=${search}&page=${page}&limit=${limit}`,
            "GET",
            null,
            token
        );
         //console.log(data);

        setProducts(data.data || []);
        setPagination(data.pagination || {});
    }

   
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(delay);
       
    }, [search, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        if (pagination.totalPages && page > pagination.totalPages) {
            setPage(pagination.totalPages);
        }
    }, [pagination.totalPages,page]);

    // async function deleteProduct(id) {
    //     await apiRequest(`/products/${id}`, "DELETE", null, token);
    //     fetchProducts();
    // }
    async function deleteProduct(id) {
        await apiRequest(`/products/${id}`, "DELETE", null, token);

        toast.success("Product deleted successfully.");
        fetchProducts();
        setConfirmDelete(null);
    }

    function openEdit(product) {
        setEditingProduct(product);
        setIsModalOpen(true);
    }

    function openCreate() {
        setEditingProduct(null);
        setIsModalOpen(true);
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Products
                </h2>
                <p className="text-gray-900 dark:text-white text-sm">
                    Manage D-BookShop and product catalog
                </p>
            </div>

              
            <div className="space-y-4">

                {/* SEARCH BAR */}
                <div className="relative">

                    <FiSearch className="absolute left-3 top-3 text-gray-400" />

                    <input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        className="
                            w-full
                            pl-10 pr-4 py-2
                            border border-gray-200
                            rounded-xl
                            focus:outline-none
                            focus:ring-2 focus:ring-blue-500
                            bg-white
                        "
                    />
                </div>
                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Products
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Manage D-BookShop and product catalog
                        </p>
                    </div>

                    <button
                        onClick={() => {setEditingProduct({}); setIsModalOpen(true);}}
                        className="
                            px-4 py-2
                            bg-blue-600 text-white
                            rounded-xl
                            hover:bg-blue-700
                            transition
                        "
                    >
                        + Add Product
                    </button>

                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full text-sm">

                        {/* HEADER */}
                        <thead className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Title</th>
                                <th className="px-6 py-4 text-left">Author</th>
                                <th className="px-6 py-4 text-left">Price</th>
                                <th className="px-6 py-4 text-left">Stock</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">

                            {products.map((p) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-blue-50 transition"
                                >

                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {p.title}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {p.author}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-green-600">
                                        €{p.price}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${p.stock > 5
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }
                                            `}
                                        >
                                            {p.stock}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4">

                                        <div className="flex gap-2">

                                            {/* EDIT */}
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(p);
                                                    setIsModalOpen(true);
                                                }}
                                                className="
                                                    flex items-center gap-1
                                                    px-3 py-1 text-xs rounded-lg
                                                    bg-blue-600 text-white
                                                    hover:bg-blue-700
                                                    transition
                                                "
                                            >
                                                <FiEdit2 size={14} />
                                                Edit
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => setConfirmDelete(p.id)}
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
            </div>

           <AnimatePresence>

                {isModalOpen && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="
                            fixed inset-0 z-50
                            flex items-center justify-center
                        "
                    >

                        {/* BACKDROP */}
                        <div
                            className="
                                absolute inset-0
                                bg-black/40
                                backdrop-blur-sm
                            "
                            onClick={() => setIsModalOpen(false)}
                        />

                        {/* MODAL */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="
                                relative
                                bg-white
                                w-full
                                max-w-3xl
                                rounded-3xl
                                shadow-2xl
                                p-8
                                z-10
                                max-h-[90vh]
                                overflow-y-auto
                                border border-gray-100
                            "
                        >

                            {/* HEADER */}
                            <div className="flex justify-between items-start mb-6 border-b pb-5">

                                <div className="flex items-center gap-4">

                                    {/* ICON */}
                                    <div
                                        className="
                                            h-14 w-14
                                            rounded-2xl
                                            bg-blue-100
                                            flex items-center justify-center
                                        "
                                    >
                                        <FiPackage
                                            size={24}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    {/* TITLE */}
                                    <div>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {editingProduct?.id
                                                ? "Edit Product"
                                                : "Create Product"}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Manage product information and inventory
                                        </p>

                                    </div>

                                </div>

                                {/* CLOSE BUTTON */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="
                                        h-10 w-10
                                        rounded-xl
                                        flex items-center justify-center
                                        hover:bg-gray-100
                                        transition
                                    "
                                >
                                    <FiX size={18} />
                                </button>

                            </div>

                            {/* FORM */}
                            <ProductForm
                                onCreated={() => {
                                    fetchProducts();
                                    setIsModalOpen(false);
                                }}
                                editingProduct={editingProduct}
                                clearEdit={() => setEditingProduct(null)}
                            />

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>
            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

                    <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">

                        <h3 className="text-lg font-semibold mb-2">
                            Confirm Deletion
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => deleteProduct(confirmDelete)}
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

                <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="
                        flex items-center gap-1
                        px-4 py-2
                        bg-gray-200
                        rounded-lg
                        disabled:opacity-50
                    "
                >
                    <FiChevronLeft />
                    Prev
                </button>

                <span className="text-gray-700 dark:text-white font-medium">
                    Page {page}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="
                        flex items-center gap-1
                        px-4 py-2
                        bg-gray-200
                        rounded-lg
                    "
                >
                    Next
                    <FiChevronRight />
                </button>

            </div>

        </div>
    );
}