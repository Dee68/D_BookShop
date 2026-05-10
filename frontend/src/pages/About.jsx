export default function About() {

    return (
        <div className="max-w-5xl mx-auto px-4 py-16">

            {/* TITLE */}
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                About D-BookShop
            </h1>

            {/* TEXT */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                D-BookShop is a modern online bookstore built for readers,
                students, developers, and professionals looking for quality
                books across technology, business, fiction, and more.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Our mission is to make discovering and purchasing books
                simple, modern, and enjoyable through a clean ecommerce
                experience.
            </p>

            {/* CARDS */}
            <div className="grid md:grid-cols-3 gap-6 mt-10">

                <div className="
                    bg-white dark:bg-zinc-900
                    rounded-2xl shadow-sm
                    p-6
                    border border-gray-100 dark:border-zinc-800
                ">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Wide Collection
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Explore books from multiple genres and categories.
                    </p>
                </div>

                <div className="
                    bg-white dark:bg-zinc-900
                    rounded-2xl shadow-sm
                    p-6
                    border border-gray-100 dark:border-zinc-800
                ">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Fast Ordering
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Secure ordering and streamlined checkout experience.
                    </p>
                </div>

                <div className="
                    bg-white dark:bg-zinc-900
                    rounded-2xl shadow-sm
                    p-6
                    border border-gray-100 dark:border-zinc-800
                ">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Modern Experience
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Built with responsive modern web technologies.
                    </p>
                </div>

            </div>

        </div>
    );
}