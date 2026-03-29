import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';
import wishlistRoutes from './routes/wishlist';
import { autoSeedIfEmpty } from './autoSeed';
import { execSync } from 'child_process';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    process.env.FRONTEND_URL || '',
    'http://localhost:3000',
    'http://localhost:5173',
].filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            cb(null, true);
        } else {
            cb(null, true); // permissive for all during dev/assignment
        }
    },
    credentials: true,
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Amazon Clone API is running' });
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Amazon Clone Backend - Active</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #131921 0%, #232f3e 50%, #37475A 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 3rem 4rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    animation: floatIn 1s ease-out forwards;
                    max-width: 600px;
                }
                .logo {
                    color: #ff9900;
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    letter-spacing: -1px;
                }
                h1 {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }
                p {
                    font-size: 1.1rem;
                    color: #e0e0e0;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                .btn {
                    display: inline-block;
                    background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
                    color: #111;
                    padding: 12px 32px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: transform 0.2s, background 0.2s;
                    box-shadow: 0 4px 12px rgba(240, 193, 75, 0.3);
                }
                .btn:hover {
                    transform: translateY(-2px);
                    background: linear-gradient(to bottom, #f0c14b, #e6af2e);
                }
                @keyframes floatIn {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">amazon.in<span style="color: #fff"> clone</span></div>
                <h1>Thank you for waking me up! 🚀</h1>
                <p>The backend server is now fully operational and ready to process your requests. Enjoy your immersive experience with Amazon.in!</p>
                <a href="${process.env.FRONTEND_URL || '#'}" class="btn">Return to Shop</a>
            </div>
        </body>
        </html>
    `);
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);


// Auto-seed and Migration on startup (free tier friendly — no Shell access needed)
(async () => {
    try {
        console.log('🔄 Running database migrations (db push)...');
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Migrations completed.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    }

    // Fix broken images in live DB
    try {
        const { prisma } = require('./db');
        await prisma.product.updateMany({
            where: { name: 'LEGO Technic 42096 Porsche 911 RSR Building Kit' },
            data: { imageUrls: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'] }
        });
        await prisma.product.updateMany({
            where: { name: 'LG 55 Inch 4K OLED Smart TV (2023 Model)' },
            data: { imageUrls: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600'] }
        });
        console.log('✅ Applied live image patches for broken products.');
    } catch (err) {
        console.error('⚠️ Image patch failed:', err);
    }

    await autoSeedIfEmpty();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})();


