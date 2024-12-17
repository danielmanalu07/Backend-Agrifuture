const cartModel = require('../models/cartModel');
const fertilizerModel = require('../models/pupuk');

class CartController {
    static async addToCart(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: User ID not found' });
            }

            const { fertilizerId } = req.body;

            if (!fertilizerId) {
                return res.status(400).json({ message: 'Invalid fertilizer ID' });
            }

            const fertilizer = await fertilizerModel.getFertilizerById(fertilizerId);
            if (!fertilizer) {
                return res.status(404).json({ message: 'Fertilizer not found' });
            }

            const quantity = 1;
            const cartItem = await cartModel.addToCart(
                userId,
                fertilizerId,
                quantity,
                fertilizer.price
            );

            res.status(201).json({
                message: 'Item added successfully',
                item: cartItem,
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { cartItemId } = req.params;
            const { status } = req.body;

            if (status == null) {
                return res.status(400).json({ message: 'status is required' });
            }

            // Validasi input
            if (!cartItemId) {
                return res.status(400).json({ message: 'Cart Item ID is required' });
            }

            // Update status
            await cartModel.updateCartItemStatus(cartItemId, status);

            res.status(200).json({ message: 'Status updated successfully' });
        } catch (error) {
            console.error('Error updating cart item status:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async updateQuantity(req, res) {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;

            if (!cartItemId) {
                return res.status(400).json({ message: 'Cart Item ID is required' });
            }

            await cartModel.updateQuantity(cartItemId, quantity);

            res.status(200).json({ message: 'Quantity updated successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}

module.exports = CartController;