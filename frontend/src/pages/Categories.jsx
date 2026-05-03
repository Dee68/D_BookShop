import { useEffect, useState } from "react";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    // LOAD
    async function loadCategories() {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
    }, []);

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

        setName("");
        loadCategories();
    }

    // DELETE
    async function deleteCategory(id) {
        await fetch(`http://localhost:3000/api/categories/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        loadCategories();
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
        <div style={{ padding: 20 }}>
            <h2>Categories</h2>

            {/* FORM */}
            <form onSubmit={editingId ? updateCategory : createCategory}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                />

                <button type="submit">
                    {editingId ? "Update" : "Add"}
                </button>

                {editingId && (
                    <button onClick={() => {
                        setEditingId(null);
                        setName("");
                    }}>
                        Cancel
                    </button>
                )}
            </form>

            {/* LIST */}
            <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.name}</td>
                            <td>
                                <button onClick={() => startEdit(cat)}>
                                    Edit
                                </button>

                                <button onClick={() => deleteCategory(cat.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}