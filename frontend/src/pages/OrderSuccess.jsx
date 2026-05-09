import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {

    const { id } = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

                {/* Icon */}
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Successful
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Your order <span className="font-semibold">#{id}</span> has been placed successfully.
                </p>

                {/* Actions */}
                <div className="space-y-3">

                    <Link
                        to="/"
                        className="
                            block w-full
                            bg-black text-white
                            py-3 rounded-xl
                            font-semibold
                            hover:bg-gray-800
                            transition
                        "
                    >
                        Continue Shopping
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="
                            block w-full
                            border border-gray-300
                            text-gray-700
                            py-3 rounded-xl
                            font-semibold
                            hover:bg-gray-100
                            transition
                        "
                    >
                        View Orders
                    </Link>

                </div>

            </div>

        </div>
    );
}