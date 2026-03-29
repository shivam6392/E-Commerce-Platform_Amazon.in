import nodemailer from 'nodemailer';

export const sendOrderConfirmationEmail = async (userEmail: string, userName: string, orderDetails: any) => {
    try {
        // Create a test account dynamically on Ethereal
        const testAccount = await nodemailer.createTestAccount();

        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // Generate HTML list of items
        const itemsHtml = orderDetails.items.map((item: any) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
            </tr>
        `).join('');

        // Email content
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #232f3e; padding: 20px; text-align: center;">
                    <h1 style="color: #ff9900; margin: 0;">amazon.in</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #333;">Order Confirmation</h2>
                    <p>Hello <strong>${userName}</strong>,</p>
                    <p>Thank you for shopping with us! Your order <strong>#${orderDetails.id}</strong> has been placed successfully and is currently being processed.</p>
                    
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
                        This is an automated confirmation email. Please do not reply to this message.
                    </p>
                </div>
            </div>
        `;

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Amazon.in Clone" <no-reply@amazonclone.test>', // sender address
            to: userEmail, // list of receivers
            subject: `Your Amazon Clone order #${orderDetails.id} is confirmed`, // Subject line
            html: html, // html body
        });

        console.log('✅ 📧 Order Email Sent successfully!');
        console.log('📬 Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('----------------------------------------------------');
        
    } catch (error) {
        console.error('❌ Failed to send email confirmation:', error);
    }
};
