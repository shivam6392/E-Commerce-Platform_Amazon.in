import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

const API = axios.create({ baseURL: BASE });


export const getProducts = (params?: { search?: string; category?: string }) =>
    API.get('/products', { params });

export const getProduct = (id: number) => API.get(`/products/${id}`);

export const getCart = () => API.get('/cart');

export const addToCart = (productId: number, quantity = 1) =>
    API.post('/cart/items', { productId, quantity });

export const updateCartItem = (itemId: number, quantity: number) =>
    API.put(`/cart/items/${itemId}`, { quantity });

export const removeCartItem = (itemId: number) =>
    API.delete(`/cart/items/${itemId}`);

export const placeOrder = (shippingAddress: string) =>
    API.post('/orders', { shippingAddress });

export const getOrders = () => API.get('/orders');

export const getOrder = (id: number) => API.get(`/orders/${id}`);
