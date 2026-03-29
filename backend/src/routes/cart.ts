import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

const DEFAULT_USER_ID = 1;

async function getOrCreateCart() {
    let cart = await prisma.cart.findFirst({
        where: { userId: DEFAULT_USER_ID },
        include: { items: { include: { product: true } } },
    });
    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: DEFAULT_USER_ID },
            include: { items: { include: { product: true } } },
        });
    }
    return cart;
}

async function recalcTotal(cartId: number) {
    const items = await prisma.cartItem.findMany({
        where: { cartId },
        include: { product: true },
    });
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    await prisma.cart.update({ where: { id: cartId }, data: { totalAmount: total } });
}

// GET /api/cart
router.get('/', async (req: Request, res: Response) => {
    const cart = await getOrCreateCart();
    res.json(cart);
});

// POST /api/cart/items - add item
router.post('/items', async (req: Request, res: Response) => {
    const { productId, quantity = 1 } = req.body;
    const cart = await getOrCreateCart();

    const existing = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId: Number(productId) },
    });

    if (existing) {
        await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + Number(quantity) },
        });
    } else {
        await prisma.cartItem.create({
            data: { cartId: cart.id, productId: Number(productId), quantity: Number(quantity) },
        });
    }
    await recalcTotal(cart.id);
    const updated = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } },
    });
    res.json(updated);
});

// PUT /api/cart/items/:id - update quantity
router.put('/items/:id', async (req: Request, res: Response) => {
    const { quantity } = req.body;
    if (Number(quantity) <= 0) {
        await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
    } else {
        await prisma.cartItem.update({
            where: { id: Number(req.params.id) },
            data: { quantity: Number(quantity) },
        });
    }
    const cart = await getOrCreateCart();
    await recalcTotal(cart.id);
    const updated = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } },
    });
    res.json(updated);
});

// DELETE /api/cart/items/:id
router.delete('/items/:id', async (req: Request, res: Response) => {
    await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
    const cart = await getOrCreateCart();
    await recalcTotal(cart.id);
    const updated = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } },
    });
    res.json(updated);
});

export default router;
