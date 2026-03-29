import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // e.g. 'yourgmail@gmail.com'
        pass: process.env.EMAIL_PASS, // 16-character App Password
    },
});

export const sendOrderConfirmationEmail = async (userEmail: string, userName: string, orderDetails: any) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ EMAIL_USER or EMAIL_PASS missing in environment variables.');
            return;
        }

        const formatOrderId = (id: number) => {
            const hash = id * 314159;
            const p1 = 400 + (id % 100);
            const p2 = String(hash % 9999999).padStart(7, '0');
            const p3 = String((hash * 7) % 9999999).padStart(7, '0');
            return `${p1}-${p2}-${p3}`;
        };

        const formattedId = formatOrderId(orderDetails.id);

        const itemsHtml = orderDetails.items.map((item: any) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
            </tr>
        `).join('');

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #232f3e; padding: 20px; text-align: center;">
                    <h1 style="color: #ff9900; margin: 0;">amazon.in</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #333;">Order Confirmation</h2>
                    <p>Hello <strong>${userName}</strong>,</p>
                    <p>Thank you for shopping with us! Your order <strong>#${formattedId}</strong> has been placed successfully and is currently being processed.</p>
                    
                    <h3>Order Details:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #f3f3f3; text-align: left;">
                                <th style="padding: 10px;">Item</th>
                                <th style="padding: 10px;">Qty</th>
                                <th style="padding: 10px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Order Total:</td>
                                <td style="padding: 10px; font-weight: bold; color: #B12704;">₹${orderDetails.totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 20px;">
                        <strong>Shipping Address:</strong><br/>
                        ${orderDetails.shippingAddress}
                    </div>

                    <p style="margin-top: 30px; font-size: 12px; color: #777;">
                        This is an automated confirmation email from Amazon Clone. Please do not reply to this message.
                    </p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"Amazon Clone" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Your Amazon Clone order #${formattedId} is confirmed`,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order Email Sent successfully via Gmail!', info.messageId);

    } catch (error) {
        console.error('❌ Failed to send email confirmation via Gmail:', error);
    }
};
