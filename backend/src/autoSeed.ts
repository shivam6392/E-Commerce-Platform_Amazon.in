import { prisma } from './db';

const products = [
    // Electronics
    {
        name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
        description: 'Experience the pinnacle of smartphone innovation with the Samsung Galaxy S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, and a powerful 200MP camera system with AI enhancements.',
        price: 124999,
        category: 'Electronics',
        imageUrls: [
            'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
        ],
        stock: 45, rating: 4.5, reviewCount: 2341,
    },
    {
        name: 'Apple MacBook Air M2 Chip 13.6 inch Laptop',
        description: 'MacBook Air with the powerful M2 chip. Up to 18-hour battery life, 8-core CPU, 8-core GPU, and a stunning Liquid Retina display with 500 nits of brightness.',
        price: 114900,
        category: 'Electronics',
        imageUrls: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
        ],
        stock: 30, rating: 4.8, reviewCount: 5612,
    },
    {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        description: 'Industry-leading noise cancellation. Crystal clear hands-free calling with 8 microphones. 30-hour battery life with quick charge.',
        price: 24990,
        category: 'Electronics',
        imageUrls: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
        ],
        stock: 120, rating: 4.7, reviewCount: 8934,
    },
    {
        name: 'LG 55 Inch 4K OLED Smart TV (2023 Model)',
        description: 'Brilliant OLED picture quality with self-lit pixels. webOS Smart TV with ThinQ AI. Dolby Vision IQ and Dolby Atmos.',
        price: 99990,
        category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600'],
        stock: 18, rating: 4.6, reviewCount: 1230,
    },
    // Clothing
    {
        name: "Levi's Men's 511 Slim Fit Jeans",
        description: "Classic slim fit jeans from Levi's. Made with stretch denim for comfort and flexibility. Machine washable.",
        price: 2999,
        category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
        stock: 200, rating: 4.4, reviewCount: 12450,
    },
    {
        name: 'Nike Air Max 270 Running Shoes for Men',
        description: 'The Nike Air Max 270 delivers a smooth ride on any terrain. The large Air unit in the heel provides maximum cushioning.',
        price: 10995,
        category: 'Clothing',
        imageUrls: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
        ],
        stock: 85, rating: 4.6, reviewCount: 7823,
    },
    {
        name: "Women's Floral Print Wrap Midi Dress",
        description: 'Elegant floral wrap dress perfect for all occasions. Made from lightweight, breathable fabric. Features adjustable waist tie and V-neckline.',
        price: 1299,
        category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'],
        stock: 350, rating: 4.2, reviewCount: 3421,
    },
    // Books
    {
        name: 'Atomic Habits by James Clear - Paperback',
        description: 'The #1 New York Times bestseller. Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones.',
        price: 499,
        category: 'Books',
        imageUrls: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
        stock: 500, rating: 4.8, reviewCount: 45231,
    },
    {
        name: 'The Psychology of Money by Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness. A must-read for understanding how people think about money.',
        price: 349,
        category: 'Books',
        imageUrls: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600'],
        stock: 420, rating: 4.7, reviewCount: 28134,
    },
    {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'A must-read for every software developer. How to write clean, maintainable code with practical examples.',
        price: 699,
        category: 'Books',
        imageUrls: ['https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600'],
        stock: 180, rating: 4.6, reviewCount: 9872,
    },
    // Home & Kitchen
    {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart',
        description: "The world's #1 multi-cooker. Pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer.",
        price: 6499,
        category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
        stock: 95, rating: 4.7, reviewCount: 34521,
    },
    {
        name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
        description: 'Laser detects invisible dust on hard floors. Up to 60 minutes of fade-free power. HEPA filtration captures allergens.',
        price: 52900,
        category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
        stock: 40, rating: 4.5, reviewCount: 5672,
    },
    {
        name: 'Philips HD9252/91 Air Fryer 1400W with Rapid Air Technology',
        description: 'Up to 90% less fat with Rapid Air Technology. 4.1L capacity for the whole family. Easy controls with pre-set cooking programs.',
        price: 9995,
        category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600'],
        stock: 160, rating: 4.4, reviewCount: 18934,
    },
    // Sports
    {
        name: 'Yoga Mat Premium 6mm Non-Slip Exercise Mat',
        description: 'Extra thick 6mm non-slip yoga mat. Eco-friendly TPE material, sweat-resistant, and easy to clean. Includes carrying strap.',
        price: 799,
        category: 'Sports',
        imageUrls: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'],
        stock: 300, rating: 4.3, reviewCount: 15231,
    },
    {
        name: 'Adjustable Dumbbell Set 5-25 kg with Stand',
        description: 'Space-saving adjustable dumbbells replace 9 sets of weights. Quick-change weight mechanism. Durable steel construction.',
        price: 12999,
        category: 'Sports',
        imageUrls: ['https://images.unsplash.com/photo-1585565804112-f201f68c48b4?w=600'],
        stock: 60, rating: 4.6, reviewCount: 4523,
    },
    // Toys
    {
        name: 'LEGO Technic 42096 Porsche 911 RSR Building Kit',
        description: 'Build a stunning 1,580-piece replica of the iconic Porsche 911 RSR race car. Features working steering and detailed engine. For ages 10+.',
        price: 8999,
        category: 'Toys',
        imageUrls: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'],
        stock: 75, rating: 4.8, reviewCount: 6821,
    },
];

export async function autoSeedIfEmpty(): Promise<void> {
    try {
        const count = await prisma.product.count();
        if (count > 0) {
            console.log(`✅ Database already has ${count} products — skipping seed.`);
            return;
        }

        console.log('🌱 Empty database detected — auto-seeding...');

        // Create default user
        await prisma.user.upsert({
            where: { email: 'default@amazon.com' },
            update: {},
            create: { name: 'Default User', email: 'default@amazon.com', password: 'password123' },
        });


        // Seed products
        for (const product of products) {
            await prisma.product.create({ data: product });
        }

        console.log(`🎉 Auto-seed complete: ${products.length} products added!`);
    } catch (err) {
        console.error('⚠️  Auto-seed failed (non-fatal):', err);
    }
}
