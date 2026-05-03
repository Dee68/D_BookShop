import { useState, useEffect, useRef } from "react";
import { apiUpload } from "../api/client";

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
    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
            .then(res => res.json())
            .then(setCategories);
    }, []);
    const MAX_SIZE = 5 * 1024 * 1024;
    function handleImages(e) {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
        if (file.size > MAX_SIZE) {
            alert(`${file.name} is too large (max 5MB)`);
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
   async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    

    Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
    });

    images.forEach(img => {
        formData.append("images", img);
    });

    let res;

    if (editingProduct) {
        // UPDATE MODE
        res = await fetch(
            `http://localhost:3000/api/products/${editingProduct.id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        ).then(r => r.json());
        //console.log(editingProduct.images);
    } else {
        // CREATE MODE
        res = await apiUpload("/products", formData, token);
    }

    if (res.message || res.productId) {
        alert(editingProduct ? "Product updated" : "Product created");
        await onCreated();
        clearEdit();
        resetForm();
       
    }
    //console.log("Update response:", res);
}
    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <h3>Create Product</h3>

            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
            <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
            <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
            >
                <option value="">Select Category</option>

                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />

           <input
                type="file"
                multiple
                ref={fileRef}
                onChange={handleImages}
            />
            {/* PREVIEW */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                {preview.map((src, i) => (
                    <img
                        key={i}
                        src={
                            src.startsWith("blob:")
                                ? src // new uploaded images
                                : `http://localhost:3000${src}` // existing images
                        }
                        width="60"
                    />
                ))}
            </div>

            <button type="submit">{editingProduct ? "Update Product" : "Create Product"}</button>
        </form>
    );
}