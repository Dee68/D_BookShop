import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

export default function HeroSlider() {

    //const BASE_IMAGE = import.meta.env.VITE_ASSET_URL;
    
 const slides = [
    {
        image: "https://res.cloudinary.com/dyrp3aqdq/image/upload/v1778597113/slide3_uzeqfn.jpg",
        title: "Discover Your Next Great Read",
        subtitle: "Explore bestselling books, timeless classics...",
        primaryBtn: "Shop Now",
        primaryLink: "#products",
        secondaryBtn: "Contact Us",
        secondaryLink: "/contact"
    },
    {
        image: "https://res.cloudinary.com/dyrp3aqdq/image/upload/v1778597112/slide1_n97hmc.jpg",
        title: "Programming & Tech Books",
        subtitle: "Level up your software engineering skills...",
        primaryBtn: "Browse Tech",
        primaryLink: "#products",
        secondaryBtn: "Contact Us",
        secondaryLink: "/contact"
    },
    {
        image: "https://res.cloudinary.com/dyrp3aqdq/image/upload/v1778597113/slide2_u0d4q4.jpg",
        title: "Bestsellers & Classics",
        subtitle: "From fiction to business strategy...",
        primaryBtn: "Explore Books",
        primaryLink: "#products",
        secondaryBtn: "About Us",
        secondaryLink: "/about"
    }
];

    const [current, setCurrent] = useState(0);

    // AUTO SLIDE
    useEffect(() => {

        const interval = setInterval(() => {

            setCurrent(prev =>
                prev === slides.length - 1 ? 0 : prev + 1
            );

        }, 5000);

        return () => clearInterval(interval);

    }, [slides.length]);

    // NEXT
    function nextSlide() {
        setCurrent(prev =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    }

    // PREV
    function prevSlide() {
        setCurrent(prev =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    }

    return (

        <section className="relative mx-4 mt-6 overflow-hidden rounded-3xl">

            {/* SLIDES */}
            <div className="relative h-[500px]">

                {slides.map((slide, index) => (

                    <div
                        key={index}
                        className={`
                            absolute inset-0 transition-opacity duration-1000
                            ${index === current
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0"}
                        `}
                    >

                        {/* IMAGE */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="
                                w-full
                                h-full
                                object-cover
                                scale-105
                                animate-[slowZoom_8s_linear_infinite]
                            "
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-black/60" />

                        {/* CONTENT */}
                        <div className="absolute inset-0 flex items-center">

                            <div className="max-w-2xl px-6 md:px-14 text-white">

                                <p className="
                                    uppercase
                                    tracking-[4px]
                                    text-yellow-400
                                    mb-3
                                    text-lg
                                    md:text-base
                                ">
                                    D-BookShop
                                </p>

                                <h1 className="
                                    text-3xl
                                    md:text-6xl
                                    font-bold
                                    leading-tight
                                    text-emerald-500
                                    mb-5
                                ">
                                    {slide.title}
                                </h1>

                                <p className="
                                    text-gray-200
                                    text-base
                                    md:text-lg
                                    mb-8
                                    leading-relaxed
                                ">
                                    {slide.subtitle}
                                </p>

                                {/* BUTTONS */}
                                <div className="flex flex-wrap gap-4">

                                   <a
                                        href={slide.primaryLink}
                                        className="
                                            bg-yellow-400
                                            text-black
                                            px-6 py-3
                                            rounded-xl
                                            font-semibold
                                            hover:bg-yellow-300
                                            transition
                                        "
                                    >
                                        {slide.primaryBtn}
                                    </a>
                                      
                                    

                                    <Link
                                            to={slide.secondaryLink}
                                            className="
                                                border border-white
                                                px-6 py-3
                                                rounded-xl
                                                hover:bg-white
                                                hover:text-black
                                                transition
                                            "
                                        >
                                            {slide.secondaryBtn}
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {/* LEFT ARROW */}
            <button
                onClick={prevSlide}
                className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    z-20
                    bg-black/40
                    hover:bg-black/60
                    text-white
                    p-3
                    rounded-full
                    backdrop-blur-sm
                    transition
                "
            >
                <FiChevronLeft size={24} />
            </button>

            {/* RIGHT ARROW */}
            <button
                onClick={nextSlide}
                className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    z-20
                    bg-black/40
                    hover:bg-black/60
                    text-white
                    p-3
                    rounded-full
                    backdrop-blur-sm
                    transition
                "
            >
                <FiChevronRight size={24} />
            </button>

            {/* INDICATORS */}
            <div className="
                absolute
                bottom-6
                left-1/2
                -translate-x-1/2
                z-20
                flex gap-3
            ">

                {slides.map((_, index) => (

                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`
                            h-3 w-3 rounded-full transition-all

                            ${index === current
                                ? "bg-yellow-400 w-8"
                                : "bg-white/60"}
                        `}
                    />

                ))}

            </div>

        </section>
    );
}