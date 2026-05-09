import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`http://localhost:3000/api/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then(setOrder);
    }, [id]);

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">Loading order...</p>
            </div>
        );
    }

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b px-6 py-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Order #{order.id}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Order details summary
                        </p>
                    </div>

                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize w-fit ${getStatusStyles(order.status)}`}
                    >
                        {order.status}
                    </span>
                </div>

                <div className="p-6 space-y-8">

                    {/* Customer */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            Customer
                        </h2>

                        <div className="bg-gray-50 border rounded-xl p-4">
                            <p className="font-medium text-gray-900">
                                {order.user?.name}
                            </p>

                            <p className="text-gray-600">
                                {order.user?.email}
                            </p>
                        </div>
                    </section>

                    {/* Items */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Items
                        </h2>

                        <div className="space-y-4">
                            {(order.items || []).map((item, i) => {
                                const imageUrl = item.image
                                    ? item.image.startsWith("http")
                                        ? item.image
                                        : `http://localhost:3000${item.image}`
                                    : null;

                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 border rounded-xl p-4 hover:shadow-md transition"
                                    >

                                        {/* Image */}
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No Image
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">
                                                {item.title}
                                            </h3>

                                            <p className="text-gray-500 mt-1">
                                                Quantity: {item.quantity}
                                            </p>

                                            <p className="text-gray-700 font-medium mt-1">
                                                €{Number(item.price).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">
                                                €
                                                {(
                                                    item.quantity * item.price
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Total */}
                    <div className="border-t pt-6 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">
                            Total
                        </span>

                        <span className="text-2xl font-bold text-gray-900">
                            €{Number(order.total).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}