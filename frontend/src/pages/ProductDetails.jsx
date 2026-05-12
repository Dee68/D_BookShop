import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FiArrowLeft } from "react-icons/fi";

export default function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const { addToCart } = useContext(CartContext);

    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {

        fetch(`${import.meta.env.VITE_API_URL}api/products/${id}`)
            .then(res => res.json())
            .then(setProduct);

    }, [id]);

    useEffect(() => {

        if (product?.images?.length) {
            setMainImage(`${import.meta.env.VITE_API_URL}${product.images[0]}`);
        }

    }, [product]);

    if (!product) {

        return (
            <div className="
                min-h-[60vh]
                flex items-center justify-center
                text-gray-500 dark:text-gray-400
            ">
                Loading product...
            </div>
        );
    }

    return (

        <div className="
            max-w-7xl
            mx-auto
            px-4 md:px-6
            py-10
        ">

            {/* BACK BUTTON */}
            <Link
                to="/"
                className="
                    inline-flex items-center gap-2
                    mb-8
                    px-4 py-2
                    rounded-xl

                    bg-white dark:bg-zinc-900
                    border border-gray-200 dark:border-zinc-800

                    text-gray-700 dark:text-gray-200

                    hover:bg-emerald-50
                    dark:hover:bg-zinc-800

                    transition-all duration-300
                    shadow-sm hover:shadow-md
                "
            >
                <FiArrowLeft />

                Back to Store
            </Link>

            {/* MAIN CARD */}
            <div className="
                grid
                md:grid-cols-2
                gap-10

                bg-white dark:bg-zinc-900
                border border-gray-100 dark:border-zinc-800

                rounded-3xl
                shadow-xl

                overflow-hidden
            ">

                {/* LEFT SIDE */}
                <div className="p-6">

                    {/* MAIN IMAGE */}
                    <div className="
                        rounded-2xl
                        overflow-hidden

                        bg-gray-100 dark:bg-zinc-800
                        border border-gray-200 dark:border-zinc-700
                    ">
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="
                                w-full
                                h-[500px]
                                object-cover
                                transition-transform duration-500
                                hover:scale-[1.02]
                            "
                        />
                    </div>

                    {/* GALLERY */}
                    <div className="
                        flex flex-wrap gap-3
                        mt-5
                    ">

                        {product.images?.map((img, i) => {

                            const fullUrl = img.startsWith("http")
                                ? img
                                : `${import.meta.env.VITE_API_URL}${img}`;

                            return (

                                <button
                                    key={i}
                                    onClick={() => setMainImage(fullUrl)}
                                    className={`
                                        rounded-xl
                                        overflow-hidden
                                        border-2
                                        transition-all duration-300

                                        ${
                                            mainImage === fullUrl
                                                ? `
                                                    border-emerald-600
                                                    shadow-md
                                                `
                                                : `
                                                    border-transparent
                                                    hover:border-emerald-400
                                                `
                                        }
                                    `}
                                >

                                    <img
                                        src={fullUrl}
                                        alt=""
                                        className="
                                            w-20 h-20
                                            object-cover
                                        "
                                    />

                                </button>
                            );
                        })}

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="
                    p-6 md:p-8
                    flex flex-col
                ">

                    {/* CATEGORY */}
                    <div className="
                        inline-flex
                        w-fit
                        px-3 py-1
                        rounded-full

                        bg-emerald-100
                        dark:bg-emerald-900/30

                        text-emerald-700
                        dark:text-emerald-300

                        text-sm
                        font-medium
                        mb-4
                    ">
                        {product.category_name || "Book"}
                    </div>

                    {/* TITLE */}
                    <h1 className="
                        text-4xl
                        font-bold
                        text-gray-900 dark:text-white
                        mb-3
                    ">
                        {product.title}
                    </h1>

                    {/* AUTHOR */}
                    <p className="
                        text-lg
                        text-gray-500 dark:text-gray-400
                        mb-6
                    ">
                        by {product.author}
                    </p>

                    {/* PRICE */}
                    <div className="
                        text-3xl
                        font-bold

                        text-emerald-700
                        dark:text-emerald-400

                        mb-6
                    ">
                        €{Number(product.price).toFixed(2)}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="
                        text-gray-600 dark:text-gray-300
                        leading-relaxed
                        mb-8
                    ">
                        {product.description}
                    </p>

                    {/* STOCK */}
                    <div className="mb-8">

                        {product.stock > 0 ? (

                            <span className="
                                inline-flex
                                px-3 py-1
                                rounded-full

                                bg-green-100
                                dark:bg-green-900/30

                                text-green-700
                                dark:text-green-300

                                text-sm font-medium
                            ">
                                In Stock ({product.stock})
                            </span>

                        ) : (

                            <span className="
                                inline-flex
                                px-3 py-1
                                rounded-full

                                bg-red-100
                                dark:bg-red-900/30

                                text-red-700
                                dark:text-red-300

                                text-sm font-medium
                            ">
                                Out of Stock
                            </span>

                        )}

                    </div>

                    {/* CTA */}
                    <button
                        onClick={(e) => {

                            e.preventDefault();

                            addToCart(product);

                        }}

                        disabled={product.stock <= 0}

                        className={`
                            w-full md:w-fit

                            px-8 py-4
                            rounded-2xl

                            font-semibold
                            text-sm

                            transition-all duration-300

                            ${
                                product.stock > 0
                                    ? `
                                        bg-emerald-600
                                        hover:bg-emerald-700

                                        text-white

                                        shadow-lg
                                        hover:shadow-xl
                                    `
                                    : `
                                        bg-gray-300
                                        dark:bg-zinc-700

                                        text-gray-500
                                        dark:text-gray-400

                                        cursor-not-allowed
                                    `
                            }
                        `}
                    >
                        {product.stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                    </button>

                </div>

            </div>

        </div>
    );
}