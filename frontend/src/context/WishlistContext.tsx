import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api';
import { useAuth } from './AuthContext';

interface WishlistItem {
    id: number;
    productId: number;
    userId: number;
    product: any;
    createdAt: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    loading: boolean;
    isWishlisted: (productId: number) => boolean;
    toggleWishlist: (productId: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshWishlist = useCallback(async () => {
        if (!user) {
            setWishlistItems([]);
            return;
        }
        setLoading(true);
        try {
            const res = await getWishlist(user.id);
            setWishlistItems(res.data);
        } catch (err) {
            console.error('Failed to fetch wishlist', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Re-fetch whenever the logged-in user changes
    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const isWishlisted = useCallback(
        (productId: number) => wishlistItems.some((item) => item.productId === productId),
        [wishlistItems]
    );

    const toggleWishlist = useCallback(
        async (productId: number) => {
            if (!user) return;
            const existing = wishlistItems.find((item) => item.productId === productId);
            if (existing) {
                // Optimistic removal
                setWishlistItems((prev) => prev.filter((i) => i.id !== existing.id));
                try {
                    await removeFromWishlist(existing.id);
                } catch (err) {
                    // Rollback on failure
                    setWishlistItems((prev) => [...prev, existing]);
                    console.error('Failed to remove from wishlist', err);
                }
            } else {
                // Optimistic add — we add a placeholder then replace once server responds
                try {
                    const res = await addToWishlist({ userId: user.id, productId });
                    setWishlistItems((prev) => [res.data, ...prev]);
                } catch (err) {
                    console.error('Failed to add to wishlist', err);
                }
            }
        },
        [user, wishlistItems]
    );

    const removeItem = useCallback(
        async (itemId: number) => {
            // Optimistic removal
            const prev = wishlistItems.find((i) => i.id === itemId);
            setWishlistItems((items) => items.filter((i) => i.id !== itemId));
            try {
                await removeFromWishlist(itemId);
            } catch (err) {
                // Rollback
                if (prev) setWishlistItems((items) => [...items, prev]);
                console.error('Failed to remove wishlist item', err);
            }
        },
        [wishlistItems]
    );

    return (
        <WishlistContext.Provider value={{ wishlistItems, loading, isWishlisted, toggleWishlist, removeItem, refreshWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
};
