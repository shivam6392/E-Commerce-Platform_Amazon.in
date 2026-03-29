import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

const API = axios.create({ baseURL: BASE });

// Add interceptor to include userId in headers
API.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('amazon_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
            config.headers['x-user-id'] = user.id.toString();
        }
    }
    return config;
});



export const getProducts = (params?: { search?: string; category?: string }) =>
    API.get('/products', { params });

export const getProduct = (id: number) => API.get(`/products/${id}`);

export const getCart = () => API.get('/cart');

export const addToCart = (productId: number, quantity = 1) =>
    API.post('/cart/items', { productId, quantity });

export const updateCartItem = (itemId: number, quantity: number) =>
    API.put(`/cart/items/${itemId}`, { quantity });

export const removeCartItem = (id: number) => API.delete(`/cart/${id}`);

// Auth
export const login = (data: any) => API.post('/auth/login', data);
export const register = (data: any) => API.post('/auth/register', data);

// Wishlist
export const getWishlist = (userId: number) => API.get(`/wishlist/${userId}`);
export const addToWishlist = (data: { userId: number; productId: number }) => API.post('/wishlist', data);
export const removeFromWishlist = (id: number) => API.delete(`/wishlist/${id}`);

// Orders
export const placeOrder = (shippingAddress: string) => API.post('/orders', { shippingAddress });

export const getOrders = () => API.get('/orders');

export const getOrder = (id: number) => API.get(`/orders/${id}`);
