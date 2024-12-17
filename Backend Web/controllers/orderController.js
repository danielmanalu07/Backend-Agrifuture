const orderModel = require('../models/orderModel');
const fertilizerModel = require('../models/pupuk');


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

    static async getOrderItemByUser(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: User ID not found' });
            }

            const items = await orderModel.getOrderItemByUser(userId);

            const itemsWithFertilizer = await Promise.all(
                items.map(async (item) => {
                    const fertilizer = await fertilizerModel.getFertilizerById(item.fertilizer_id);
                    return {
                        ...item,
                        fertilizer: fertilizer,
                    };
                })
            );

            res.status(200).json({
                message: 'Items with fertilizers retrieved successfully',
                items: itemsWithFertilizer,
            })

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = OrderController;
