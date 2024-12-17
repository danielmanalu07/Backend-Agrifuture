const orderModel = require('../models/orderModel');

class OrderController {
    static async addToOrder(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: User ID not found' });
            }

            const cartItems = await orderModel.getCartItemsByUserId(userId);

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ message: 'No items in cart with status true' });
            }
            console.log('Cart Items : ', cartItems);

            const result = await orderModel.addToOrderFromCart(userId, cartItems);

            res.status(200).json({
                message: 'Order created successfully',
                order: {
                    id: result.orderId,
                    totalPrice: result.totalPrice,
                    status: result.orderStatus,
                },
            });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

module.exports = OrderController;
