import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const user = await prisma.user.create({
            data: { name, email, password },
        });

        // Initialize empty cart for new user
        await prisma.cart.create({ data: { userId: user.id } });

        res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
