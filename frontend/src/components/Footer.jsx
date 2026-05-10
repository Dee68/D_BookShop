import { Link } from "react-router-dom";
import {
    FiFacebook,
    FiInstagram,
    FiTwitter,
    FiMail
} from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="
            bg-emerald-900
            dark:bg-zinc-950
            text-white
            transition-colors duration-500
        ">

            <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

                {/* BRAND */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-white dark:text-white">
                        D-BookShop
                    </h2>

                    <p className="text-emerald-100 dark:text-zinc-400 text-sm leading-6">
                        Discover programming, business, fiction,
                        and technology books curated for modern readers.
                    </p>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h3 className="font-semibold mb-4">
                        Quick Links
                    </h3>

                    <div className="flex flex-col gap-3 text-sm text-emerald-100 dark:text-zinc-400">

                        <Link to="/" className="hover:text-white transition">
                            Home
                        </Link>

                        <Link to="/contact" className="hover:text-white transition">
                            Contact
                        </Link>

                        <Link to="/login" className="hover:text-white transition">
                            Login
                        </Link>

                        <Link to="/register" className="hover:text-white transition">
                            Register
                        </Link>

                    </div>
                </div>

                {/* SUPPORT */}
                <div>
                    <h3 className="font-semibold mb-4">
                        Support
                    </h3>

                    <div className="flex flex-col gap-3 text-sm text-emerald-100 dark:text-zinc-400">
                        <p>Help Center</p>
                        <p>Privacy Policy</p>
                        <p>Terms & Conditions</p>
                        <p>Shipping Info</p>
                    </div>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="font-semibold mb-4">
                        Contact
                    </h3>

                    <div className="space-y-3 text-sm text-emerald-100 dark:text-zinc-400">

                        <p className="flex items-center gap-2">
                            <FiMail />
                            support@dbookshop.com
                        </p>

                        <div className="flex gap-4 pt-3 text-xl text-emerald-100 dark:text-zinc-400">

                            <a href="#" className="hover:text-white transition">
                                <FiFacebook />
                            </a>

                            <a href="#" className="hover:text-white transition">
                                <FiInstagram />
                            </a>

                            <a href="#" className="hover:text-white transition">
                                <FiTwitter />
                            </a>

                        </div>

                    </div>
                </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="
                border-t border-emerald-800
                dark:border-zinc-800
                py-4 text-center text-sm
                text-emerald-100 dark:text-zinc-500
            ">
                © {new Date().getFullYear()} D-BookShop. All rights reserved.
            </div>

        </footer>
    );
}