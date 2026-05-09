import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import "../styles/productDetails.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => res.json())
            .then(setProduct);
    }, [id]);

    useEffect(() => {
        if (product?.images?.length) {
            setMainImage(`http://localhost:3000${product.images[0]}`);
        }
    }, [product]);

    if (!product) return <p>Loading...</p>;

    return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

        {/* LEFT: IMAGE + GALLERY */}
        <div>

            {/* MAIN IMAGE */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
                <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-[500px] object-cover"
                />
            </div>

            {/* GALLERY (MOVED HERE) */}
            <div className="flex gap-2 mt-4">
                {product.images?.map((img, i) => {
                    const fullUrl = img.startsWith("http")
                        ? img
                        : `http://localhost:3000${img}`;

                    return (
                        <img
                            key={i}
                            src={fullUrl}
                            className="w-16 h-16 object-cover rounded-md cursor-pointer border hover:border-black"
                            onClick={() => setMainImage(fullUrl)}
                        />
                    );
                })}
            </div>

        </div>

        {/* RIGHT: INFO */}
        <div>
            <Link
                to="/"
                className="inline-flex items-center gap-2 mb-4 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
                Go Back
            </Link>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            <p className="text-gray-500 mb-4">
                by {product.author}
            </p>

            <p className="text-2xl font-bold mb-4">
                €{Number(product.price).toFixed(2)}
            </p>

            <p className="text-gray-700 mb-6">
                {product.description}
            </p>

            <button 
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800" 
                onClick={(e) => {e.preventDefault();addToCart(product);}}
                disabled={product.stock <= 0}>
                Add to Cart
            </button>
        </div>

    </div>
);
}