// pages/VerifyEmail.jsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!token) {
                    setStatus("error");
                    setMessage("Invalid verification link.");
                    return;
                }

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/users/verify-email?token=${token}`
                );

                const data = await res.json();

                if (!res.ok) {
                    setStatus("error");
                    setMessage(data.error || "Verification failed.");
                    return;
                }

                setStatus("success");
                setMessage(data.message || "Email verified successfully.");

                setTimeout(() => {
                    navigate("/login");
                }, 3000);

            } catch (error) {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">

                {/* Logo / Brand */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        D_BookShop
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Email Verification
                    </p>
                </div>

                {/* Loading */}
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

                        <p className="mt-4 text-gray-700 dark:text-gray-300">
                            Verifying your email...
                        </p>
                    </div>
                )}

                {/* Success */}
                {status === "success" && (
                    <div className="text-center">
                        <div className="text-5xl mb-4">
                            ✅
                        </div>

                        <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                            Verification Successful
                        </h2>

                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                            {message}
                        </p>

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Redirecting to login...
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition duration-200"
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="text-center">
                        <div className="text-5xl mb-4">
                            ❌
                        </div>

                        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
                            Verification Failed
                        </h2>

                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                            {message}
                        </p>

                        <button
                            onClick={() => navigate("/register")}
                            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition duration-200"
                        >
                            Back to Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}