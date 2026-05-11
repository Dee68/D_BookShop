import { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import "../styles/global.css";
import { Link } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const { addToCart } = useContext(CartContext);
    const [page, setPage] = useState(1);
    

    async function loadProducts() {
        const limit = 8;
        const res = await fetch(
           `http://localhost:3000/api/products?page=${page}&limit=${limit}&search=${search}&category=${category}`
        );

        const data = await res.json();
        console.log(data);
        setProducts(Array.isArray(data.data) ? data.data : []);
        setPagination(data.pagination || {});
       
        
    }

   
    useEffect(() => {
        const delay = setTimeout(() => {
            loadProducts();
        }, 300);

        return () => clearTimeout(delay);
    }, [search, category, page]);

    
    useEffect(() => {
        async function loadCategories() {
            const res = await fetch("http://localhost:3000/api/categories/store");
            const data = await res.json();

            setCategories(Array.isArray(data) ? data : data.data || []);
        }

        loadCategories();
    }, []);

    useEffect(() => {
            setPage(1);
    }, [search, category]);

    return (
        <>
        {/* <Navbar /> */}
            <div className="min-h-screen
                bg-emerald-50
                text-gray-900

                dark:bg-zinc-950
                dark:text-white

                transition-colors duration-500">
                {/* hero section */}
                <HeroSlider />

                {/* SEARCH BAR */}
                <div className="max-w-7xl mx-auto
                        px-4 py-6
                        flex flex-col md:flex-row
                        gap-4"
                    >

                        <input
                            className="flex-1
                            px-4 py-3
                            rounded-2xl
                            border border-emerald-100 dark:border-zinc-800
                            bg-white dark:bg-zinc-900
                            text-gray-900 dark:text-white
                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                            shadow-sm
                            focus:outline-none
                            focus:ring-2 focus:ring-emerald-500
                            transition"
                            placeholder="Search books by title or author..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="md:w-64
                            px-4 py-3
                            rounded-2xl
                            border border-emerald-100 dark:border-zinc-800
                            bg-white dark:bg-zinc-900
                            text-gray-900 dark:text-white
                            shadow-sm
                            focus:outline-none
                            focus:ring-2 focus:ring-emerald-500
                            transition"
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
                <div id="products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 py-6">
                    {Array.isArray(products) && products.map(p => {
                        
                        const imagePath = p.images?.[0];

                        const imageUrl = imagePath
                            ? imagePath.startsWith("http")
                                ? imagePath
                                : `http://localhost:3000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
                            : null;
                        
                        return (
                            <Link key={p.id} to={`/product/${p.id}`} className="block">
                                <div
                                        key={p.id}
                                        className="
                                            group
                                            bg-white
                                            rounded-2xl
                                            overflow-hidden
                                            shadow-sm
                                            hover:-translate-y-1
                                            hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]
                                            dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
                                            dark:bg-zinc-900
                                            border border-emerald-100
                                            dark:border-zinc-800
                                            transition-all
                                            duration-300
                                            flex
                                            flex-col
                                        "
                                >

                                        {/* IMAGE */}
                                        <div className="relative overflow-hidden bg-gray-100">

                                            <img
                                                src={imageUrl || "/images/no-image.png"}
                                                alt={p.title}
                                                className="
                                                    w-full
                                                    h-48
                                                    object-cover
                                                    group-hover:scale-105
                                                    transition-transform
                                                    duration-500
                                                "
                                            />

                                            {/* STOCK BADGE */}
                                            <div className="absolute top-3 left-3">
                                                    {p.stock > 0 ? (
                                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                            In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                            </div>

                                        </div>

                                        {/* CONTENT */}
                                        <div className="p-5 flex flex-col flex-1">

                                            {/* CATEGORY */}
                                            <p className="
                                                text-xs uppercase tracking-wide
                                                text-emerald-600 dark:text-emerald-400
                                                mb-2
                                                font-medium
                                            ">
                                                {p.category_name}
                                            </p>

                                            {/* TITLE */}
                                            <h3 className="
                                                text-base font-semibold
                                                text-gray-900 dark:text-white
                                                mb-2 leading-snug
                                                line-clamp-2
                                            ">
                                                {p.title}
                                            </h3>

                                            {/* AUTHOR */}
                                            <p className="
                                                text-sm
                                                text-gray-600 dark:text-gray-300
                                                mb-3
                                            ">
                                                by {p.author || "Unknown Author"}
                                            </p>

                                            {/* PRICE */}
                                            <div className="mb-5">
                                                <span className="
                                                    text-2xl font-bold
                                                    text-emerald-700 dark:text-emerald-400
                                                ">
                                                    €{Number(p.price).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* BUTTON */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(p);
                                                }}
                                                disabled={p.stock <= 0}
                                                className={`
                                                    mt-auto
                                                    py-2.5
                                                    px-4
                                                    text-sm
                                                    rounded-xl
                                                    font-semibold
                                                    transition-all
                                                    duration-300

                                                    ${
                                                        p.stock > 0
                                                            ? `
                                                                bg-emerald-700
                                                                text-white
                                                                hover:bg-emerald-800

                                                                dark:bg-emerald-600
                                                                dark:hover:bg-emerald-500

                                                                shadow-md
                                                                hover:shadow-xl
                                                            `
                                                            : `
                                                                bg-gray-300 dark:bg-zinc-700
                                                                text-gray-500 dark:text-gray-400
                                                                cursor-not-allowed
                                                            `
                                                    }
                                                `}
                                            >
                                                {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                            </button>

                                        </div>
                                </div>
                            </Link>
                                    )
                                    
                                })}
                </div>
                {/* Pagination */}
                <div className="flex justify-center items-center gap-3 py-10">

                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(prev => prev - 1)}
                        className="
                            px-4 py-2
                            rounded-lg
                            bg-emerald-700
                            hover:bg-emerald-800
                            dark:bg-emerald-600
                            dark:hover:bg-emerald-500
                            text-white
                            text-white
                            disabled:bg-gray-300
                        "
                    >
                        Prev
                    </button>

                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            Page {pagination.page || 1} of {pagination.totalPages || 1}
                        </span>

                    <button
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                        className="
                            px-4 py-2
                            rounded-lg
                            bg-emerald-700
                            hover:bg-emerald-800
                            dark:bg-emerald-600
                            dark:hover:bg-emerald-500
                            text-white
                            text-white
                            disabled:bg-gray-300
                        "
                    >
                        Next
                    </button>

                </div>

            </div>
                    
        </>
    );

}