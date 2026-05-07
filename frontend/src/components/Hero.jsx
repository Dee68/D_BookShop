import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative overflow-hidden rounded-3xl mx-4 mt-6">

            {/* BACKGROUND IMAGE */}
            <img
                src="/images/hero.jpg"
                alt="Books Collection"
                className="w-full h-[500px] object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/55" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center">

                <div className="max-w-2xl px-6 md:px-14 text-white">

                    <p className="uppercase tracking-[4px] text-yellow-400 mb-3 text-sm md:text-base">
                        D-BookShop
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
                        Discover Your <br />
                        Next Great Read
                    </h1>

                    <p className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed">
                        Explore bestselling books, timeless classics,
                        programming guides, business reads, and more —
                        all in one modern bookstore.
                    </p>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-4">

                        <Link
                            to="/"
                            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
                        >
                            Shop Now
                        </Link>

                        <Link
                            to="/my-orders"
                            className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
                        >
                            My Orders
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}