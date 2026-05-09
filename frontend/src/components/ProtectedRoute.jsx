import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function ProtectedRoute({
    children,
    role
}) {

    const token = localStorage.getItem("token");

    // Not logged in
    if (!token) {

        //toast.error("Please login first");

        return <Navigate to="/login" replace />;
    }

    // Role-based protection
    if (role) {

        try {

            const decoded = jwtDecode(token);

            if (decoded.role !== role) {

                toast.error("Unauthorized access prohibited");

                return <Navigate to="/" replace />;
            }

        } catch (err) {

            localStorage.removeItem("token");

            return <Navigate to="/login" replace />;
        }
    }

    return children;
}