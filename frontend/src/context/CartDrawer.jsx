import { useContext } from "react";
import { CartContext } from "./CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartDrawer({ open, onClose }) {

    const {
        cart,
        increase,
        decrease,
        removeFromCart,
        total
    } = useContext(CartContext);

    if (!open) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    fixed top-0 right-0 h-full w-full sm:w-[420px]
                    bg-white shadow-2xl z-50
                    flex flex-col
                    animate-in slide-in-from-right
                "
            >

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-gray-700" />

                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Cart
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            p-2 rounded-full
                            hover:bg-gray-100
                            transition
                        "
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="w-14 h-14 text-gray-300 mb-4" />

                            <p className="text-lg font-medium text-gray-700">
                                Your cart is empty
                            </p>

                            <p className="text-sm text-gray-400 mt-2">
                                Add some products to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">

                            {cart.map((item) => {

                                // const imageUrl = item.images?.[0]
                                //     ? `${import.meta.env.VITE_API_URL}${item.images[0]}`
                                //     : null;
                                const imageUrl = item.images?.[0] || null;

                                return (
                                    <div
                                        key={item.id}
                                        className="
                                            flex gap-4
                                            border rounded-2xl
                                            p-4
                                            hover:shadow-md
                                            transition
                                        "
                                    >

                                        {/* Image */}
                                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">

                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">

                                            <div className="flex items-start justify-between gap-3">

                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    className="
                                                        text-gray-400
                                                        hover:text-red-500
                                                        transition
                                                    "
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-4">

                                                <div
                                                    className="
                                                        flex items-center
                                                        border rounded-lg
                                                        overflow-hidden
                                                    "
                                                >

                                                    <button
                                                        onClick={() =>
                                                            decrease(item.id)
                                                        }
                                                        className="
                                                            px-3 py-2
                                                            hover:bg-gray-100
                                                            transition
                                                        "
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>

                                                    <span className="px-4 text-sm font-medium">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            increase(item.id)
                                                        }
                                                        className="
                                                            px-3 py-2
                                                            hover:bg-gray-100
                                                            transition
                                                        "
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="font-bold text-gray-900">
                                                    {formatCurrency(
                                                        item.price * item.quantity
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t px-6 py-5 space-y-4">

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-700">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(total)}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                (window.location.href = "/checkout")
                            }
                            className="
                                w-full
                                bg-black text-white
                                py-4 rounded-xl
                                font-semibold
                                hover:bg-gray-800
                                transition
                            "
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}