import { useState } from "react";
import { apiRequest } from "../../api/client";
import { toast } from "react-toastify";
import { cardClass } from "../../styles/ui";

export default function ChangePassword() {
    const [currentPassword, setCurrent] = useState("");
    const [newPassword, setNew] = useState("");
    const [confirm, setConfirm] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (newPassword !== confirm) {
            toast.error("Passwords don't match");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const data = await apiRequest(
                "/api/users/change-password",
                "PUT",
                { currentPassword, newPassword },
                token
            );
            if (data?.error) {
                toast.error(data.error);
                return;
            }
            toast.success("Password updated");
        } catch (err) {
            toast.error("Server error");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-zinc-950 px-4">
            <div className={cardClass}>
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    Change Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="password" placeholder="Current password"
                        value={currentPassword} onChange={e => setCurrent(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                    <input type="password" placeholder="New password"
                        value={newPassword} onChange={e => setNew(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                    <input type="password" placeholder="Confirm new password"
                        value={confirm} onChange={e => setConfirm(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}