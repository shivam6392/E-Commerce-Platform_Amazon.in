import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { sendOrderConfirmationEmail } from '../utils/mailer';

const router = Router();

const DEFAULT_USER_ID = 1;

// POST /api/orders - place order from cart
router.post('/', async (req: Request, res: Response) => {
    const { shippingAddress } = req.body;
    const userId = Number(req.headers['x-user-id'] || 1);
    if (!shippingAddress) return res.status(400).json({ error: 'Shipping address is required' });

    const cart = await prisma.cart.findFirst({
        where: { userId },

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
            userId: userId,
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

    // 1. Deduct exact stock from the products dynamically
    const stockUpdates = cart.items.map(item => 
        prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
        })
    );

    // 2. Clear out the cart entirely so the user doesn't double-order
    const clearCartItems = prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
    });
    const updateCartTotal = prisma.cart.update({
        where: { id: cart.id },
        data: { totalAmount: 0 }
    });

    // Execute all updates simultaneously safely in a transaction
    await prisma.$transaction([...stockUpdates, clearCartItems, updateCartTotal]);

    // Trigger Async Email Notification (Bonus Feature)
    sendOrderConfirmationEmail(cart.user.email, cart.user.name, order).catch(console.error);

    res.json(order);
});


// GET /api/orders - get all orders for specific user
router.get('/', async (req: Request, res: Response) => {
    const userId = Number(req.headers['x-user-id'] || 1);
    const orders = await prisma.order.findMany({
        where: { userId },
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
