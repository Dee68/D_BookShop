import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Avatar from "./Avatar";

export default function UserMenu() {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    if (!user) {
        return (
            <Link to="/login" className="text-emerald-700 hover:underline">
                Login
            </Link>
        );
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 hover:opacity-80 transition"
            >
                <Avatar name={user.name || user.email} />
                <span className="hidden sm:inline text-gray-800 dark:text-white">
                    {user.name?.split(" ")[0] || "Account"}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden z-50">
                    <Link to="/my-orders"
                        className="block px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                        onClick={() => setOpen(false)}>
                        My Orders
                    </Link>

                    {user.role === "admin" && (
                        <Link to="/admin"
                            className="block px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                            onClick={() => setOpen(false)}>
                            Admin Panel
                        </Link>
                    )}

                    <Link to="/account/change-password"
                        className="block px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                        onClick={() => setOpen(false)}>
                        Change Password
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}