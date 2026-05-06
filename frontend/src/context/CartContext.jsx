import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(product) {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);

            if (existing) {
                return prev.map(p =>
                    p.id === product.id
                        ? { ...p, qty: p.qty + 1 }
                        : p
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
    }

    function removeFromCart(id) {
        setCart(prev => prev.filter(i => i.id !== id));
    }

    function updateQty(id, qty) {
        setCart(prev =>
            prev.map(i =>
                i.id === id ? { ...i, qty } : i
            )
        );
    }

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}