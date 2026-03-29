import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

const DEFAULT_USER_ID = 1;

// POST /api/orders - place order from cart
router.post('/', async (req: Request, res: Response) => {
    const { shippingAddress } = req.body;
    if (!shippingAddress) return res.status(400).json({ error: 'Shipping address is required' });

    const cart = await prisma.cart.findFirst({
        where: { userId: DEFAULT_USER_ID },
        include: {
            user: true,
            items: { include: { product: true } }
        },
    });


    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const order = await prisma.order.create({
        data: {
            userId: DEFAULT_USER_ID,
            totalAmount: cart.totalAmount,
            shippingAddress,
            items: {
                create: cart.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
            },
        },
        include: { items: { include: { product: true } } },
    });

    // Mocked Email Notification (Bonus Feature)
    console.log(`📧 EMAIL NOTIFICATION: Order #${order.id} placed for ${cart.user.name} (${cart.user.email}). 
    Total: ₹${order.totalAmount}. Shipping to: ${shippingAddress}`);

    res.json(order);
});


// GET /api/orders - get all orders for default user
router.get('/', async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
        where: { userId: DEFAULT_USER_ID },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
});

// GET /api/orders/:id - single order
router.get('/:id', async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) },
        include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
});

export default router;
