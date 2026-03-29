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
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
            <style>
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body, html {
                    height: 100%;
                    font-family: 'Inter', sans-serif;
                    color: #fff;
                    overflow: hidden;
                }
                body {
                    background: linear-gradient(135deg, #0a0f1a 0%, #131921 30%, #1a2940 60%, #232f3e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                /* ─── Render logo watermark blended into background ─── */
                .bg-logo {
                    position: fixed;
                    bottom: -60px;
                    right: -40px;
                    width: 480px;
                    height: 480px;
                    opacity: 0.04;
                    pointer-events: none;
                    animation: floatLogo 8s ease-in-out infinite;
                    filter: blur(1px);
                }
                .bg-logo-2 {
                    position: fixed;
                    top: -80px;
                    left: -60px;
                    width: 360px;
                    height: 360px;
                    opacity: 0.025;
                    pointer-events: none;
                    transform: rotate(180deg);
                    animation: floatLogo2 10s ease-in-out infinite;
                    filter: blur(2px);
                }

                /* Ambient glow orbs */
                .glow-1 {
                    position: fixed;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(70,200,130,0.08) 0%, transparent 70%);
                    bottom: -100px; right: -100px;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: pulse1 6s ease-in-out infinite;
                }
                .glow-2 {
                    position: fixed;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(255,153,0,0.06) 0%, transparent 70%);
                    top: -80px; left: -80px;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: pulse2 7s ease-in-out infinite;
                }

                /* ─── Card ─── */
                .container {
                    position: relative;
                    z-index: 10;
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    padding: 3rem 3.5rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
                    max-width: 560px;
                    width: 90%;
                    text-align: center;
                    animation: cardIn 1s cubic-bezier(0.16,1,0.3,1) forwards;
                    opacity: 0;
                }

                /* ─── Render badge ─── */
                .render-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(70,200,130,0.12);
                    border: 1px solid rgba(70,200,130,0.25);
                    border-radius: 24px;
                    padding: 6px 16px;
                    margin-bottom: 1.5rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #46c882;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                .render-badge svg {
                    width: 18px;
                    height: 18px;
                    fill: #46c882;
                }

                /* ─── Brand ─── */
                .brand {
                    font-size: 2.2rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                    margin-bottom: 0.75rem;
                }
                .brand .am { color: #ff9900; }
                .brand .cl { color: rgba(255,255,255,0.5); font-weight: 500; font-size: 1.6rem; }

                h1 {
                    font-size: 1.6rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    line-height: 1.35;
                    background: linear-gradient(135deg, #fff, #b0bec5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .subtitle {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.55);
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                /* ─── Status pill ─── */
                .status {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(70,200,130,0.1);
                    border: 1px solid rgba(70,200,130,0.2);
                    border-radius: 20px;
                    padding: 5px 14px;
                    font-size: 0.78rem;
                    color: #46c882;
                    margin-bottom: 1.5rem;
                }
                .status-dot {
                    width: 8px; height: 8px;
                    background: #46c882;
                    border-radius: 50%;
                    animation: blink 2s ease-in-out infinite;
                }

                /* ─── Button ─── */
                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #f7dfa5, #f0c14b);
                    color: #111;
                    padding: 14px 36px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1rem;
                    transition: all 0.25s ease;
                    box-shadow: 0 6px 20px rgba(240,193,75,0.25);
                }
                .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(240,193,75,0.35);
                    background: linear-gradient(135deg, #f0c14b, #e6af2e);
                }

                .footer-note {
                    margin-top: 1.5rem;
                    font-size: 0.72rem;
                    color: rgba(255,255,255,0.25);
                }

                /* ─── Animations ─── */
                @keyframes cardIn {
                    0% { opacity: 0; transform: translateY(40px) scale(0.97); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes floatLogo {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes floatLogo2 {
                    0%, 100% { transform: rotate(180deg) translateY(0); }
                    50% { transform: rotate(180deg) translateY(-15px); }
                }
                @keyframes pulse1 {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                @keyframes pulse2 {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.08); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            </style>
        </head>
        <body>
            <!-- Ambient glow orbs -->
            <div class="glow-1"></div>
            <div class="glow-2"></div>

            <!-- Render logo watermarks blended into background -->
            <svg class="bg-logo" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 512V256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512H0Z" fill="white"/>
            </svg>
            <svg class="bg-logo-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 512V256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512H0Z" fill="white"/>
            </svg>

            <div class="container">
                <div class="render-badge">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 512V256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512H0Z"/>
                    </svg>
                    Powered by Render
                </div>

                <div class="brand"><span class="am">amazon.in</span> <span class="cl">clone</span></div>
                <h1>Thank you for waking me up! 🚀</h1>
                <p class="subtitle">The backend server is now fully operational and ready to process your requests. Enjoy your immersive experience with Amazon.in!</p>

                <div class="status">
                    <span class="status-dot"></span>
                    All systems operational
                </div>
                <br><br>

                <a href="${process.env.FRONTEND_URL || '#'}" class="btn">Return to Shop</a>

                <p class="footer-note">Hosted on Render · Free Tier · Auto-sleeps after 15 min of inactivity</p>
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
        const imagePatches = [
            {
                name: 'LEGO Technic 42096 Porsche 911 RSR Building Kit',
                imageUrls: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'],
            },
            {
                name: 'LG 55 Inch 4K OLED Smart TV (2023 Model)',
                imageUrls: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600'],
            },
            {
                name: 'Keychron K2 Pro Mechanical Keyboard (Wireless)',
                imageUrls: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
            },
            {
                name: "Men's Premium Cotton Hoodie - Oversized Fit",
                imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
            },
            {
                name: 'Boldfit Resistance Bands Set for Workout',
                imageUrls: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600'],
            },
        ];
        for (const patch of imagePatches) {
            await prisma.product.updateMany({ where: { name: patch.name }, data: { imageUrls: patch.imageUrls } });
        }
        console.log(' Applied live image patches for broken products.');
    } catch (err) {
        console.error(' Image patch failed:', err);
    }

    await autoSeedIfEmpty();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})();


