export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    stock: number;
    rating: number;
    reviewCount: number;
}

export interface CartItem {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: number;
    userId: number;
    totalAmount: number;
    items: CartItem[];
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order {
    id: number;
    userId: number;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    items: OrderItem[];
    createdAt: string;
}
