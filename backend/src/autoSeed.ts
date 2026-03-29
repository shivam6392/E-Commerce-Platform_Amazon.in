import { prisma } from './db';

const products = [
    // ── Electronics (10 items) ─────────────────────────────────────────────
    {
        name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
        description: 'Experience the pinnacle of smartphone innovation with the Samsung Galaxy S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, and a powerful 200MP camera system with AI enhancements.',
        price: 124999, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'],
        stock: 45, rating: 4.5, reviewCount: 2341,
    },
    {
        name: 'Apple MacBook Air M2 Chip 13.6 inch Laptop',
        description: 'MacBook Air with the powerful M2 chip. Up to 18-hour battery life, 8-core CPU, 8-core GPU, and a stunning Liquid Retina display with 500 nits of brightness.',
        price: 114900, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'],
        stock: 30, rating: 4.8, reviewCount: 5612,
    },
    {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        description: 'Industry-leading noise cancellation. Crystal clear hands-free calling with 8 microphones. 30-hour battery life with quick charge.',
        price: 24990, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'],
        stock: 120, rating: 4.7, reviewCount: 8934,
    },
    {
        name: 'LG 55 Inch 4K OLED Smart TV (2023 Model)',
        description: 'Brilliant OLED picture quality with self-lit pixels. webOS Smart TV with ThinQ AI. Dolby Vision IQ and Dolby Atmos.',
        price: 99990, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600'],
        stock: 18, rating: 4.6, reviewCount: 1230,
    },
    {
        name: 'Apple iPad Pro 12.9 inch (M2, Wi-Fi, 256GB)',
        description: 'The ultimate iPad experience with the Apple M2 chip, Liquid Retina XDR display, ProMotion technology, and Thunderbolt/USB 4 connectivity. Works with Apple Pencil and Magic Keyboard.',
        price: 112900, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
        stock: 40, rating: 4.8, reviewCount: 3210,
    },
    {
        name: 'Canon EOS R50 Mirrorless Camera with 18-45mm Lens',
        description: 'Lightweight and compact mirrorless camera with a 24.2MP APS-C sensor. Perfect for content creators with 4K video, Dual Pixel CMOS AF II, and Wi-Fi connectivity.',
        price: 74995, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'],
        stock: 25, rating: 4.7, reviewCount: 1876,
    },
    {
        name: 'Samsung Galaxy Watch 6 Classic 47mm Smartwatch',
        description: 'Classic rotating bezel design with advanced health monitoring including blood oxygen, ECG, and sleep coaching. 40-hour battery life, water resistant.',
        price: 32999, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'],
        stock: 65, rating: 4.5, reviewCount: 4521,
    },
    {
        name: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Advanced wireless mouse with 8K DPI tracking on any surface, MagSpeed electromagnetic scroll wheel, quiet clicks, and ergonomic design for all-day comfort.',
        price: 9995, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'],
        stock: 200, rating: 4.7, reviewCount: 12340,
    },
    {
        name: 'Keychron K2 Pro Mechanical Keyboard (Wireless)',
        description: 'Compact 75% layout mechanical keyboard with hot-swappable switches, RGB backlight, and Bluetooth 5.1. Compatible with Mac and Windows. Gateron Brown switches.',
        price: 8499, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1563191911-e65a8f7c34ab?w=600'],
        stock: 90, rating: 4.6, reviewCount: 5678,
    },
    {
        name: 'Sony PlayStation 5 Console (Disc Edition)',
        description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback, adaptive triggers and 3D Audio. Play PS5 and PS4 games.',
        price: 54990, category: 'Electronics',
        imageUrls: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600'],
        stock: 15, rating: 4.9, reviewCount: 24500,
    },

    // ── Clothing (10 items) ────────────────────────────────────────────────
    {
        name: "Levi's Men's 511 Slim Fit Jeans",
        description: "Classic slim fit jeans from Levi's. Made with stretch denim for comfort and flexibility. Machine washable.",
        price: 2999, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
        stock: 200, rating: 4.4, reviewCount: 12450,
    },
    {
        name: 'Nike Air Max 270 Running Shoes for Men',
        description: 'The Nike Air Max 270 delivers a smooth ride on any terrain. The large Air unit in the heel provides maximum cushioning.',
        price: 10995, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600'],
        stock: 85, rating: 4.6, reviewCount: 7823,
    },
    {
        name: "Women's Floral Print Wrap Midi Dress",
        description: 'Elegant floral wrap dress perfect for all occasions. Made from lightweight, breathable fabric. Features adjustable waist tie and V-neckline.',
        price: 1299, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'],
        stock: 350, rating: 4.2, reviewCount: 3421,
    },
    {
        name: 'Men\'s Premium Cotton Hoodie - Oversized Fit',
        description: 'Ultra-soft 400 GSM cotton blend hoodie with a relaxed, oversized silhouette. Features kangaroo pocket, adjustable drawstring hood, and ribbed cuffs.',
        price: 1499, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
        stock: 300, rating: 4.5, reviewCount: 9870,
    },
    {
        name: 'Allen Solly Men\'s Regular Fit Formal Shirt',
        description: 'Classic formal shirt in premium cotton fabric with a regular fit. Perfect for office wear. Available in multiple colors.',
        price: 1299, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600'],
        stock: 250, rating: 4.3, reviewCount: 6540,
    },
    {
        name: 'Adidas Women\'s Ultraboost 23 Running Shoes',
        description: 'Revolutionary running shoe with BOOST midsole for ultimate energy return. Primeknit+ upper adapts to the shape of your foot. CONTINENTAL rubber outsole for traction.',
        price: 15999, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
        stock: 70, rating: 4.7, reviewCount: 5430,
    },
    {
        name: 'H&M Men\'s Slim Fit Chino Trousers',
        description: 'Slim fit chino trousers in cotton twill. Features a zip fly with button, side pockets, and back pockets. Classic and versatile for any occasion.',
        price: 999, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
        stock: 400, rating: 4.1, reviewCount: 8920,
    },
    {
        name: 'U.S. POLO ASSN. Women\'s Solid Crop Top',
        description: 'Comfortable and stylish crop top in soft jersey fabric. Perfect for casual wear or layering. Features a relaxed fit with short sleeves.',
        price: 599, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600'],
        stock: 500, rating: 4.0, reviewCount: 14230,
    },
    {
        name: 'Fossil Men\'s Gen 5E Smartwatch - Hybrid',
        description: 'The perfect blend of traditional watch style and smartwatch functionality. Heart rate monitor, NFC payments, GPS, and a 1-week battery life in a handsome case.',
        price: 14995, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600'],
        stock: 55, rating: 4.4, reviewCount: 3120,
    },
    {
        name: 'Ray-Ban Aviator Classic Unisex Sunglasses',
        description: 'The Aviator is an iconic style that has stood the test of time. Crystal green lenses with a gold metal frame provide 100% UV protection.',
        price: 6990, category: 'Clothing',
        imageUrls: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
        stock: 110, rating: 4.5, reviewCount: 7800,
    },

    // ── Books (3 items) ────────────────────────────────────────────────────
    {
        name: 'Atomic Habits by James Clear - Paperback',
        description: 'The #1 New York Times bestseller. Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones.',
        price: 499, category: 'Books',
        imageUrls: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
        stock: 500, rating: 4.8, reviewCount: 45231,
    },
    {
        name: 'The Psychology of Money by Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness. A must-read for understanding how people think about money.',
        price: 349, category: 'Books',
        imageUrls: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600'],
        stock: 420, rating: 4.7, reviewCount: 28134,
    },
    {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'A must-read for every software developer. How to write clean, maintainable code with practical examples.',
        price: 699, category: 'Books',
        imageUrls: ['https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600'],
        stock: 180, rating: 4.6, reviewCount: 9872,
    },

    // ── Home & Kitchen (10 items) ──────────────────────────────────────────
    {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart',
        description: "The world's #1 multi-cooker. Pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer.",
        price: 6499, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
        stock: 95, rating: 4.7, reviewCount: 34521,
    },
    {
        name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
        description: 'Laser detects invisible dust on hard floors. Up to 60 minutes of fade-free power. HEPA filtration captures allergens.',
        price: 52900, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
        stock: 40, rating: 4.5, reviewCount: 5672,
    },
    {
        name: 'Philips HD9252/91 Air Fryer 1400W with Rapid Air Technology',
        description: 'Up to 90% less fat with Rapid Air Technology. 4.1L capacity for the whole family. Easy controls with pre-set cooking programs.',
        price: 9995, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600'],
        stock: 160, rating: 4.4, reviewCount: 18934,
    },
    {
        name: 'Nutribullet Pro 900 Series Blender',
        description: 'Powerful 900-watt blender that crushes, blends, and mixes whole fruits, vegetables, and more. Includes two cups and to-go lids.',
        price: 4999, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'],
        stock: 130, rating: 4.3, reviewCount: 12300,
    },
    {
        name: 'Nescafe Dolce Gusto Genio S Plus Coffee Machine',
        description: 'Enjoy café-quality beverages at home. Compatible with all Nescafé Dolce Gusto pods. 15-bar pump, 1L water tank, and fast heat-up time.',
        price: 8490, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
        stock: 75, rating: 4.6, reviewCount: 8760,
    },
    {
        name: 'Borosil Prima Glass Cookware Set (3-Piece)',
        description: 'Premium borosilicate glass cookware set including a saucepan, casserole, and frying pan. Oven, microwave, and dishwasher safe. Non-toxic and BPA-free.',
        price: 2299, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1556910585-09baa3a3998e?w=600'],
        stock: 200, rating: 4.2, reviewCount: 6540,
    },
    {
        name: 'Solimo 400 TC Egyptian Cotton King Bedsheet Set',
        description: 'Ultra-soft 400 thread count Egyptian cotton bedsheet with two pillow covers. Breathable, durable, and machine washable. Perfect for year-round comfort.',
        price: 1199, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
        stock: 350, rating: 4.4, reviewCount: 22100,
    },
    {
        name: 'Milton Thermosteel Flip Lid Flask 1000ml',
        description: 'Double-walled thermosteel flask that keeps beverages hot for 24 hours and cold for 48 hours. Leak-proof flip lid, food-grade stainless steel interior.',
        price: 699, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
        stock: 500, rating: 4.5, reviewCount: 31200,
    },
    {
        name: 'Pigeon by Stovekraft 3 Layer Stainless Steel Pressure Cooker 5L',
        description: 'Heavy-duty 5L stainless steel pressure cooker with tri-ply base for even heat distribution. For induction and gas stoves. ISI certified safety valve.',
        price: 1799, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600'],
        stock: 180, rating: 4.3, reviewCount: 15600,
    },
    {
        name: 'Amazon Basics 600 GSM Luxury Towel Set (4-Piece)',
        description: 'Plush 600 GSM ring-spun cotton towels: 2 bath towels and 2 hand towels. Superior softness, high absorbency, and machine washable.',
        price: 1599, category: 'Home & Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
        stock: 290, rating: 4.4, reviewCount: 19800,
    },

    // ── Sports (4 items) ──────────────────────────────────────────────────
    {
        name: 'Yoga Mat Premium 6mm Non-Slip Exercise Mat',
        description: 'Extra thick 6mm non-slip yoga mat. Eco-friendly TPE material, sweat-resistant, and easy to clean. Includes carrying strap.',
        price: 799, category: 'Sports',
        imageUrls: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'],
        stock: 300, rating: 4.3, reviewCount: 15231,
    },
    {
        name: 'Adjustable Dumbbell Set 5-25 kg with Stand',
        description: 'Space-saving adjustable dumbbells replace 9 sets of weights. Quick-change weight mechanism. Durable steel construction.',
        price: 12999, category: 'Sports',
        imageUrls: ['https://images.unsplash.com/photo-1585565804112-f201f68c48b4?w=600'],
        stock: 60, rating: 4.6, reviewCount: 4523,
    },
    {
        name: 'Boldfit Resistance Bands Set for Workout',
        description: 'Set of 5 fabric resistance bands in varying resistance levels. Perfect for glute activation, stretching, and full-body workouts. Non-slip, durable design.',
        price: 499, category: 'Sports',
        imageUrls: ['https://images.unsplash.com/photo-1598289431512-b97b0917afb5?w=600'],
        stock: 400, rating: 4.2, reviewCount: 18900,
    },
    {
        name: 'Yonex Astrox 88D Pro Badminton Racquet',
        description: 'Professional-grade badminton racquet with rotational generator system. AERO-BOX frame maximizes air resistance. Pre-strung with BG65 at 24 lbs.',
        price: 8999, category: 'Sports',
        imageUrls: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600'],
        stock: 55, rating: 4.7, reviewCount: 3210,
    },

    // ── Toys (1 item) ─────────────────────────────────────────────────────
    {
        name: 'LEGO Technic 42096 Porsche 911 RSR Building Kit',
        description: 'Build a stunning 1,580-piece replica of the iconic Porsche 911 RSR race car. Features working steering and detailed engine. For ages 10+.',
        price: 8999, category: 'Toys',
        imageUrls: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'],
        stock: 75, rating: 4.8, reviewCount: 6821,
    },
];

export async function autoSeedIfEmpty(): Promise<void> {
    try {
        console.log('🔄 Syncing product catalog...');

        // Create default user
        await prisma.user.upsert({
            where: { email: 'default@amazon.com' },
            update: {},
            create: { name: 'Default User', email: 'default@amazon.com', password: 'password123' },
        });

        let added = 0;
        for (const product of products) {
            const existing = await prisma.product.findFirst({ where: { name: product.name } });
            if (!existing) {
                await prisma.product.create({ data: product });
                added++;
            }
        }

        const total = await prisma.product.count();
        if (added > 0) {
            console.log(`🎉 Sync complete: ${added} new products added! (${total} total in DB)`);
        } else {
            console.log(`✅ Catalog up to date: ${total} products in DB — nothing to add.`);
        }
    } catch (err) {
        console.error('⚠️  Auto-seed failed (non-fatal):', err);
    }
}
