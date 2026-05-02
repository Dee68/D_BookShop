import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const token = localStorage.getItem("token");

    async function fetchProducts() {
        const res = await apiRequest(
            `/products?search=${search}&page=${page}&limit=${limit}`,
            "GET",
            null,
            token
        );

        setProducts(res.data || []);
    }

    useEffect(() => {
        fetchProducts();
    }, [search, page]);

    async function deleteProduct(id) {
        await apiRequest(`/products/${id}`, "DELETE", null, token);
        fetchProducts();
    }

    return (
        <div>
            <h2>Products</h2>

            {/* SEARCH */}
            <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                }}
                style={{ padding: 8, marginBottom: 10, width: "100%" }}
            />

            {/* TABLE */}
            <table width="100%" cellPadding="10">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{p.author}</td>
                            <td>${p.price}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button onClick={() => deleteProduct(p.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div style={{ marginTop: 20 }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>Page {page}</span>

                <button onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}