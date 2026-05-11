import {
    FiBookOpen,
    FiShoppingCart,
    FiMonitor
} from "react-icons/fi";

export default function About() {

    return (
        <div className="
            max-w-6xl
            mx-auto
            px-4
            py-16
        ">

            {/* HERO / INTRO FRAME */}
            <div className="
                max-w-3xl
                mx-auto
                text-center
                mb-14

                bg-white dark:bg-zinc-900
                border border-emerald-100 dark:border-zinc-800

                rounded-3xl
                shadow-xl

                px-8
                py-12

                transition-colors duration-500
            ">

                <h1 className="
                    text-4xl
                    md:text-5xl
                    font-bold
                    mb-6

                    text-gray-900 dark:text-white
                ">
                    About D-BookShop
                </h1>

                <p className="
                    text-gray-600 dark:text-gray-300
                    leading-relaxed
                    text-lg
                    mb-5
                ">
                    D-BookShop is a modern online bookstore built for readers,
                    students, developers, and professionals looking for quality
                    books across technology, business, fiction, and more.
                </p>

                <p className="
                    text-gray-600 dark:text-gray-300
                    leading-relaxed
                    text-lg
                ">
                    Our mission is to make discovering and purchasing books
                    simple, modern, and enjoyable through a clean ecommerce
                    experience.
                </p>

            </div>

            {/* FEATURE CARDS */}
            <div className="
                grid
                md:grid-cols-3
                gap-8
            ">

                {/* CARD 1 */}
                <div className="
                    group

                    bg-white dark:bg-zinc-900
                    border border-emerald-100 dark:border-zinc-800

                    rounded-3xl
                    p-8

                    shadow-md
                    hover:shadow-2xl

                    hover:-translate-y-2
                    transition-all duration-300
                ">

                    <div className="
                        w-14 h-14
                        rounded-2xl

                        bg-emerald-100
                        dark:bg-emerald-900/30

                        flex items-center justify-center

                        mb-5

                        group-hover:scale-110
                        transition-transform duration-300
                    ">
                        <FiBookOpen
                            size={26}
                            className="text-emerald-700 dark:text-emerald-400"
                        />
                    </div>

                    <h3 className="
                        font-semibold
                        text-xl
                        mb-3

                        text-gray-900 dark:text-white
                    ">
                        Wide Collection
                    </h3>

                    <p className="
                        text-gray-500 dark:text-gray-400
                        leading-relaxed
                    ">
                        Explore books from multiple genres including
                        programming, business, fiction, technology,
                        and professional development.
                    </p>

                </div>

                {/* CARD 2 */}
                <div className="
                    group

                    bg-white dark:bg-zinc-900
                    border border-emerald-100 dark:border-zinc-800

                    rounded-3xl
                    p-8

                    shadow-md
                    hover:shadow-2xl

                    hover:-translate-y-2
                    transition-all duration-300
                ">

                    <div className="
                        w-14 h-14
                        rounded-2xl

                        bg-emerald-100
                        dark:bg-emerald-900/30

                        flex items-center justify-center

                        mb-5

                        group-hover:scale-110
                        transition-transform duration-300
                    ">
                        <FiShoppingCart
                            size={26}
                            className="text-emerald-700 dark:text-emerald-400"
                        />
                    </div>

                    <h3 className="
                        font-semibold
                        text-xl
                        mb-3

                        text-gray-900 dark:text-white
                    ">
                        Fast Ordering
                    </h3>

                    <p className="
                        text-gray-500 dark:text-gray-400
                        leading-relaxed
                    ">
                        Enjoy secure ordering, smooth checkout,
                        and a streamlined shopping experience
                        across all devices.
                    </p>

                </div>

                {/* CARD 3 */}
                <div className="
                    group

                    bg-white dark:bg-zinc-900
                    border border-emerald-100 dark:border-zinc-800

                    rounded-3xl
                    p-8

                    shadow-md
                    hover:shadow-2xl

                    hover:-translate-y-2
                    transition-all duration-300
                ">

                    <div className="
                        w-14 h-14
                        rounded-2xl

                        bg-emerald-100
                        dark:bg-emerald-900/30

                        flex items-center justify-center

                        mb-5

                        group-hover:scale-110
                        transition-transform duration-300
                    ">
                        <FiMonitor
                            size={26}
                            className="text-emerald-700 dark:text-emerald-400"
                        />
                    </div>

                    <h3 className="
                        font-semibold
                        text-xl
                        mb-3

                        text-gray-900 dark:text-white
                    ">
                        Modern Experience
                    </h3>

                    <p className="
                        text-gray-500 dark:text-gray-400
                        leading-relaxed
                    ">
                        Built using modern responsive web technologies
                        with elegant dark mode support and smooth UI
                        interactions.
                    </p>

                </div>

            </div>

        </div>
    );
}