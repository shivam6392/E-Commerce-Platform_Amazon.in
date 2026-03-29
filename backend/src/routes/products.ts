import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();


// GET /api/products - with optional search & category filter
router.get('/', async (req: Request, res: Response) => {
    const { search, category } = req.query;
    const where: any = {};
    if (search) where.name = { contains: String(search), mode: 'insensitive' };
    if (category && category !== 'All') where.category = String(category);
    const products = await prisma.product.findMany({ where, orderBy: { id: 'asc' } });
    res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

export default router;
