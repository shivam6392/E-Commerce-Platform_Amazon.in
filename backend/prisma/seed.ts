import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);


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
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
        ],
        stock: 45,
        rating: 4.5,
        reviewCount: 2341,
    },
    {
        name: 'Apple MacBook Air M2 Chip 13.6 inch Laptop',
        description: 'MacBook Air with the powerful M2 chip. Up to 18-hour battery life, 8-core CPU, 8-core GPU, and a stunning Liquid Retina display with 500 nits of brightness.',
        price: 114900,
        category: 'Electronics',
        imageUrls: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
            'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=600',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
        ],
        stock: 30,
        rating: 4.8,
        reviewCount: 5612,
    },
    {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        description: 'Industry-leading noise cancellation with our Integrated Processor V1. Crystal clear hands-free calling with 8 microphones. 30-hour battery life with quick charge.',
        price: 24990,
        category: 'Electronics',
        imageUrls: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
        ],
        stock: 120,
        rating: 4.7,
        reviewCount: 8934,
    },
    {
        name: 'LG 55 Inch 4K OLED Smart TV (2023 Model)',
        description: 'Brilliant OLED picture quality with self-lit pixels. webOS Smart TV with ThinQ AI. Dolby Vision IQ and Dolby Atmos for an immersive cinema-like experience at home.',
        price: 99990,
        category: 'Electronics',
        imageUrls: [
            'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        ],
        stock: 18,
        rating: 4.6,
        reviewCount: 1230,
    },
    // Clothing
    {
        name: 'Levi\'s Men\'s 511 Slim Fit Jeans',
        description: 'Classic slim fit jeans from Levi\'s. Made with stretch denim for comfort and flexibility. Sits below waist with a slim leg opening. Machine washable.',
        price: 2999,
        category: 'Clothing',
        imageUrls: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
            'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600',
        ],
        stock: 200,
        rating: 4.4,
        reviewCount: 12450,
    },
    {
        name: 'Nike Air Max 270 Running Shoes for Men',
        description: 'The Nike Air Max 270 delivers a smooth ride on any terrain. The large Air unit in the heel provides maximum cushioning. Breathable mesh upper keeps your feet cool.',
        price: 10995,
        category: 'Clothing',
        imageUrls: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
            'https://images.unsplash.com/photo-1584735175315-9d5df23be4c8?w=600',
        ],
        stock: 85,
        rating: 4.6,
        reviewCount: 7823,
    },
    {
        name: 'Women\'s Floral Print Wrap Midi Dress',
        description: 'Elegant floral wrap dress perfect for all occasions. Made from lightweight, breathable fabric. Features adjustable waist tie and V-neckline. Available in multiple colors.',
        price: 1299,
        category: 'Clothing',
        imageUrls: [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
        ],
        stock: 350,
        rating: 4.2,
        reviewCount: 3421,
    },
    // Books
    {
        name: 'Atomic Habits by James Clear - Paperback',
        description: 'The #1 New York Times bestseller. Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones. Over 10 million copies sold worldwide.',
        price: 499,
        category: 'Books',
        imageUrls: [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
        ],
        stock: 500,
        rating: 4.8,
        reviewCount: 45231,
    },
    {
        name: 'The Psychology of Money by Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness. A must-read for anyone who wants to understand how people think about money and make better financial decisions.',
        price: 349,
        category: 'Books',
        imageUrls: [
            'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600',
            'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600',
        ],
        stock: 420,
        rating: 4.7,
        reviewCount: 28134,
    },
    {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'A must-read for every software developer. Robert C. Martin shows how to write clean, maintainable code with practical examples and detailed explanations.',
        price: 699,
        category: 'Books',
        imageUrls: [
            'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600',
            'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600',
        ],
        stock: 180,
        rating: 4.6,
        reviewCount: 9872,
    },
    // Home & Kitchen
    {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart',
        description: 'The world\'s #1 multi-cooker. Pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer. 13 customizable smart programs and 12+ safety features.',
        price: 6499,
        category: 'Home & Kitchen',
        imageUrls: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
        ],
        stock: 95,
        rating: 4.7,
        reviewCount: 34521,
    },
    {
        name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
        description: 'Laser detects invisible dust on hard floors. Automatically optimizes power based on debris density. Up to 60 minutes of fade-free power. HEPA filtration captures allergens.',
        price: 52900,
        category: 'Home & Kitchen',
        imageUrls: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
            'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600',
        ],
        stock: 40,
        rating: 4.5,
        reviewCount: 5672,
    },
    {
        name: 'Philips HD9252/91 Air Fryer 1400W with Rapid Air Technology',
        description: 'Up to 90% less fat with Rapid Air Technology. 4.1L capacity for the whole family. Easy controls, pre-set cooking programs, and dishwasher-safe parts for effortless cleaning.',
        price: 9995,
        category: 'Home & Kitchen',
        imageUrls: [
            'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
            'https://images.unsplash.com/photo-1576401769578-9cfee040e7c0?w=600',
        ],
        stock: 160,
        rating: 4.4,
        reviewCount: 18934,
    },
    // Sports
    {
        name: 'Yoga Mat Premium 6mm Non-Slip Exercise Mat',
        description: 'Extra thick 6mm non-slip yoga mat for superior comfort and joint protection. Eco-friendly TPE material, sweat-resistant, and easy to clean. Includes carrying strap.',
        price: 799,
        category: 'Sports',
        imageUrls: [
            'https://images.unsplash.com/photo-1601925228239-8f6e8384e28e?w=600',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
        ],
        stock: 300,
        rating: 4.3,
        reviewCount: 15231,
    },
    {
        name: 'Adjustable Dumbbell Set 5-25 kg with Stand',
        description: 'Space-saving adjustable dumbbells replace 9 sets of weights. Quick-change weight mechanism. Durable steel construction with chrome handle. Includes storage stand.',
        price: 12999,
        category: 'Sports',
        imageUrls: [
            'https://images.unsplash.com/photo-1585565804112-f201f68c48b4?w=600',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
        ],
        stock: 60,
        rating: 4.6,
        reviewCount: 4523,
    },
    // Toys
    {
        name: 'LEGO Technic 42096 Porsche 911 RSR Building Kit',
        description: 'Build a stunning 1,580-piece replica of the iconic Porsche 911 RSR race car. Features working steering, detailed engine, and authentic racing livery. For ages 10 and up.',
        price: 8999,
        category: 'Toys',
        imageUrls: [
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600',
            'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600',
        ],
        stock: 75,
        rating: 4.8,
        reviewCount: 6821,
    },
];

async function main() {
    console.log('🌱 Starting seed...');

    // Create default user
    const user = await prisma.user.upsert({
        where: { email: 'default@amazon.com' },
        update: {},
        create: {
            name: 'Default User',
            email: 'default@amazon.com',
        },
    });
    console.log('✅ Default user created:', user.email);

    // Seed products
    for (const product of products) {
        await prisma.product.upsert({
            where: { id: products.indexOf(product) + 1 },
            update: {},
            create: product,
        });
    }
    console.log(`✅ ${products.length} products seeded successfully`);
    console.log('🎉 Seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
