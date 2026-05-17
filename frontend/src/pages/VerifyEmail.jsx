// pages/VerifyEmail.jsx

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [message, setMessage] = useState("Verifying...");
    const [error, setError] = useState("");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/users/verify-email?token=${token}`
                );

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Verification failed");
                    return;
                }

                setMessage(data.message);

            } catch (err) {
                setError("Something went wrong");
            }
        };

        if (token) {
            verify();
        }
    }, [token]);

    return (
        <div>
            {error ? <h2>{error}</h2> : <h2>{message}</h2>}
        </div>
    );
}