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

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);


// Auto-seed and Migration on startup (free tier friendly — no Shell access needed)
(async () => {
    try {
        console.log('🔄 Running database migrations...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migrations completed.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    }

    await autoSeedIfEmpty();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})();


