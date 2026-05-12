import { useState, useEffect, useRef } from "react";
import { apiUpload } from "../api/client";
import { toast } from "react-toastify";

export default function ProductForm({ onCreated, editingProduct, clearEdit }) {
    const [form, setForm] = useState({
        title: "",
        author: "",
        price: "",
        category_id: "",
        stock: ""
    });

    const [categories, setCategories] = useState([]);

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const token = localStorage.getItem("token");
    const fileRef = useRef(null); 

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    
   async function loadCategories() {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}api/categories/store`
            );

            const data = await res.json();

            setCategories(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : []
            );

        } catch (err) {

            console.error("Failed to load categories", err);
            setCategories([]);
        }
    }
 
    useEffect(() => {
        loadCategories();
    }, []);

    
    
    const MAX_SIZE = 5 * 1024 * 1024;
    function handleImages(e) {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
        if (file.size > MAX_SIZE) {
            //alert(`${file.name} is too large (max 5MB)`);
            toast.warning(`${file.name} is too large (max 5MB)`);
            return false;
        }
        return true;
    });

    setImages(validFiles);
    setPreview(validFiles.map(file => URL.createObjectURL(file)));
}

    useEffect(() => {
    if (editingProduct) {
        setForm({
            title: editingProduct.title || "",
            author: editingProduct.author || "",
            price: editingProduct.price || "",
            category_id: editingProduct.category_id || "",
            stock: editingProduct.stock || ""
        });

        setPreview(editingProduct.images || []);
    }
}, [editingProduct]);

   function resetForm() {
        setForm({
            title: "",
            author: "",
            price: "",
            category_id: "",
            stock: ""
        });

        setImages([]);
        setPreview([]);

        if (fileRef.current) {
            fileRef.current.value = "";
        }
    }
  //console.log("Reloading products...");
  // Form submission
    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(form).forEach(key => {
            // formData.append(
            //     key,
            //     key === "category_id" ? Number(form[key]) : form[key]
            // );
            formData.append(
                key,
                key === "category_id"
                    ? Number(form[key]) || null
                    : form[key]
            );
        });

        images.forEach(img => {
            formData.append("images", img);
        });

        try {
            let res;
            const isEditing = Boolean(editingProduct?.id);
            if (isEditing) {
                res = await apiUpload(
                    `api/products/${editingProduct.id}`,
                    formData,
                    token,
                    "PUT"
                );
            } else {
                res = await apiUpload("api/products", formData, token,"POST");
            }

            if (!res || res.error) {
                toast.error(res?.error || "Operation failed");
                return;
            }

            toast.success(
                isEditing ? "Product updated successfully" : "Product created successfully"
            );

            await onCreated();
            clearEdit();
            resetForm();

        } catch (err) {
            toast.error("Server error");
        }
    }
    return (
    <form
        onSubmit={handleSubmit}
        className="space-y-6 text-gray-900 dark:text-white"
    >

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* TITLE */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                </label>

                <input
                    name="title"
                    placeholder="Book title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="
                                w-full
                                px-4 py-3
                                rounded-2xl
                                border border-emerald-200
                                dark:border-zinc-700
                                bg-white
                                dark:bg-zinc-900
                                text-gray-900 dark:text-white
                                placeholder:text-gray-400
                                focus:outline-none
                                focus:ring-2 focus:ring-emerald-500
                                transition
                            "
                />
            </div>

            {/* AUTHOR */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                </label>

                <input
                    name="author"
                    placeholder="Author name"
                    value={form.author}
                    onChange={handleChange}
                   className="
                            w-full
                            px-4 py-3
                            rounded-2xl
                            border border-emerald-200
                            dark:border-zinc-700
                            bg-white
                            dark:bg-zinc-900
                            text-gray-900 dark:text-white
                            placeholder:text-gray-400
                            focus:outline-none
                            focus:ring-2 focus:ring-emerald-500
                            transition
                        "
                />
            </div>

            {/* PRICE */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (€)
                </label>

                <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    required
                   className="
                        w-full
                        px-4 py-3
                        rounded-2xl
                        border border-emerald-200
                        dark:border-zinc-700
                        bg-white
                        dark:bg-zinc-900
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                        transition
                    "
                />
            </div>

            {/* STOCK */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock
                </label>

                <input
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="
                        w-full
                        px-4 py-3
                        rounded-2xl
                        border border-emerald-200
                        dark:border-zinc-700
                        bg-white
                        dark:bg-zinc-900
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                        transition
                    "
                />
            </div>

        </div>

        {/* CATEGORY */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
            </label>

            <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="
                    w-full
                    px-4 py-3
                    rounded-2xl
                    border border-emerald-200
                    dark:border-zinc-700
                    bg-white
                    dark:bg-zinc-900
                    text-gray-900 dark:text-white
                    focus:outline-none
                    focus:ring-2 focus:ring-emerald-500
                    transition
                "
            >
                <option value="">
                    Select Category
                </option>

                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Images
            </label>

            <input
                type="file"
                multiple
                ref={fileRef}
                onChange={handleImages}
                className="
                    w-full
                    text-sm
                    border-2 border-dashed border-emerald-300
                    dark:border-zinc-700
                    rounded-2xl
                    p-5
                    bg-emerald-50/40
                    dark:bg-zinc-900
                    cursor-pointer
                    hover:border-emerald-500
                    transition
                "
            />
        </div>

        {/* IMAGE PREVIEW */}
        {preview.length > 0 && (
            <div className="flex flex-wrap gap-3">

                {preview.map((src, i) => (

                    <img
                        key={i}
                        src={
                            src.startsWith("blob:")
                                ? src
                                : src.startsWith("http")
                                    ? src
                                    : `${import.meta.env.VITE_API_URL}${src}`
                        }
                        alt=""
                        className="
                            w-20 h-20
                            object-cover
                            rounded-2xl
                            border border-emerald-100
                            dark:border-zinc-700
                            shadow-sm
                        "
                    />

                ))}

            </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-2">

            {editingProduct && (
                <button
                    type="button"
                    onClick={() => {
                        clearEdit();
                        resetForm();
                    }}
                    className="
                        px-5 py-3
                        rounded-xl
                        bg-zinc-200
                        dark:bg-zinc-800
                        text-gray-800
                        dark:text-white
                        hover:bg-zinc-300
                        dark:hover:bg-zinc-700
                        transition
                    "
                >
                    Cancel
                </button>
            )}

            <button
                type="submit"
                className="
                    px-6 py-3
                    rounded-xl
                    text-white
                    font-medium
                    bg-emerald-700
                    hover:bg-emerald-800
                    dark:bg-emerald-600
                    dark:hover:bg-emerald-500
                    text-white
                    transition
                    shadow-sm
                "
            >
                {editingProduct?.id ? "Update Product" : "Create Product"}
            </button>

        </div>

    </form>
);
}