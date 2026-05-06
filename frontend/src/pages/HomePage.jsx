import { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import "../styles/global.css";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const { addToCart } = useContext(CartContext);
    

    async function loadProducts() {
        const res = await fetch(
            `http://localhost:3000/api/products?search=${search}&category=${category}`
        );

        const data = await res.json();
        //setProducts(data.data);
        setProducts(Array.isArray(data.data) ? data.data : []);
       
        
    }

   
    useEffect(() => {
        const delay = setTimeout(() => {
            loadProducts();
        }, 300);

        return () => clearTimeout(delay);
    }, [search, category]);

    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
            .then(res => res.json())
            .then(setCategories);
    }, []);

    return (
        <>
        <Navbar />
        <div className="home">

            {/* SEARCH BAR */}
            <div className="filters">
                <input
                    placeholder="Search by title or author"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>

                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid">
                {Array.isArray(products) && products.map(p => {
                    
                    const imagePath = p.images?.[0];

                    const imageUrl = imagePath
                        ? imagePath.startsWith("http")
                            ? imagePath
                            : `http://localhost:3000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
                        : null;
                    
                    return (
                        <div key={p.id} className="card">
                        <div className="image-wrapper">
                           {p.images && p.images.length > 0 ? (
                                <img
                                    src={imageUrl}
                                    alt={p.title}
                                    style={{
                                                width: "200px",
                                                height: "200px",
                                                border: "3px solid red",
                                                display: "block",
                                                background: "yellow"
                                            }}
                                />
                                
                            ) : (
                                <div className="no-image">No image</div>
                            )}
                        </div>
                        <h3>{p.title}</h3>
                        <p>{p.author}</p>
                        <strong>€{Number(p.price).toFixed(2)}</strong>

                        <button onClick={() => addToCart(p)}>Add to Cart</button>
                    </div>
                    )
                    
                })}
            </div>

        </div>
        </>
    );

}