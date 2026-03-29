import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// GET /api/wishlist/:userId
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const items = await prisma.wishlistItem.findMany({
            where: { userId: Number(req.params.userId) },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// POST /api/wishlist
router.post('/', async (req: Request, res: Response) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'User ID and Product ID required' });

    try {
        const item = await prisma.wishlistItem.upsert({
            where: {
                userId_productId: {
                    userId: Number(userId),
                    productId: Number(productId),
                },
            },
            create: {
                userId: Number(userId),
                productId: Number(productId),
            },
            update: {}, // Do nothing if already exists
            include: { product: true },
        });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// DELETE /api/wishlist/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.wishlistItem.delete({
            where: { id: Number(req.params.id) },
        });
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

export default router;
