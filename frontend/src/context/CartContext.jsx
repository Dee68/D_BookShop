import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    // Clear cart
    function clearCart() {
        setCart([]);
    }

    // persist cart
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    //  ADD TO CART
    function addToCart(product) {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);

            if (existing) {
                return prev.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    }

    //  INCREASE
    function increase(id) {
        setCart(prev =>
            prev.map(p =>
                p.id === id ? { ...p, quantity: p.quantity + 1 } : p
            )
        );
    }

    //  DECREASE
    function decrease(id) {
        setCart(prev =>
            prev
                .map(p =>
                    p.id === id
                        ? { ...p, quantity: p.quantity - 1 }
                        : p
                )
                .filter(p => p.quantity > 0)
        );
    }

    //  REMOVE
    function removeFromCart(id) {
        setCart(prev => prev.filter(p => p.id !== id));
    }

    //  TOTAL
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increase,
                decrease,
                removeFromCart,
                total,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}