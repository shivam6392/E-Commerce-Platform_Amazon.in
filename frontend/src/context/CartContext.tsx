import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Cart } from '../types';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api';

interface CartContextType {
    cart: Cart | null;
    cartCount: number;
    loading: boolean;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    updateItem: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshCart = async () => {
        try {
            const res = await getCart();
            setCart(res.data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    const addItem = async (productId: number, quantity = 1) => {
        setLoading(true);
        try {
            const res = await addToCart(productId, quantity);
            setCart(res.data);
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (itemId: number, quantity: number) => {
        setLoading(true);
        try {
            const res = await updateCartItem(itemId, quantity);
            setCart(res.data);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId: number) => {
        setLoading(true);
        try {
            const res = await removeCartItem(itemId);
            setCart(res.data);
        } finally {
            setLoading(false);
        }
    };

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, loading, addItem, updateItem, removeItem, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
