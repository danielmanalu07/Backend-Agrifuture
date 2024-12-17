const pool = require('../config/database');

const Cart = {
    async getCartByUserId(userId) {
        try {
            const query = 'SELECT * FROM carts WHERE user_id = ?';
            const [rows] = await pool.query(query, [userId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error fetching cart by user ID:', error);
            throw new Error('Could not fetch cart');
        }
    },

    async addToCart(userId, fertilizerId, quantity, price) {
        try {
            let cart = await this.getCartByUserId(userId);

            if (!cart) {
                const createQuery = 'INSERT INTO carts (user_id) VALUES (?)';
                const [createResult] = await pool.query(createQuery, [userId]);
                cart = { id: createResult.insertId, userId };
            }

            const addItemQuery = `
                INSERT INTO cart_items (cart_id, fertilizer_id, quantity, price) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    quantity = quantity + VALUES(quantity),
                    price = VALUES(price)`;

            const [result] = await pool.query(addItemQuery, [cart.id, fertilizerId, quantity, price]);

            return {
                id: result.insertId || null,
                cartId: cart.id,
                fertilizerId,
                quantity,
                price
            };
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw new Error('Could not add item to cart');
        }
    },

    async updateCartItemStatus(id, status) {
        try {
            const queryCheck = 'SELECT * FROM cart_items WHERE id = ?';
            const [cart] = await pool.query(queryCheck, [id]);

            if (cart.length === 0) {
                throw new Error('Cart Item Not Found');
            }

            // Perbaikan: Typo pada kata UPADATE menjadi UPDATE
            const query = 'UPDATE cart_items SET status = ? WHERE id = ?';
            await pool.query(query, [status, id]);

            return { message: 'Status updated successfully' };
        } catch (error) {
            console.error('Error updating cart item status:', error);
            throw new Error('Could not update cart item status');
        }
    },

    async updateQuantity(id, quantity) {
        try {
            const queryCheck = 'SELECT * FROM cart_items WHERE id = ?';
            const [cart] = await pool.query(queryCheck, [id]);

            if (cart.length === 0) {
                throw new Error('Cart item not found');
            }

            if (quantity === 0) {
                const deleteQuery = 'DELETE FROM cart_items WHERE id = ?';
                await pool.query(deleteQuery, [id]);
                return { message: 'Item deleted successfully because quantity is 0' };
            }

            const query = 'UPDATE cart_items SET quantity = ? where id = ?';
            await pool.query(query, [quantity, id]);
            return { message: 'Quantity Updated Successfully' };
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            throw new Error('Could not update cart item quantity');
        }
    },
};

module.exports = Cart;