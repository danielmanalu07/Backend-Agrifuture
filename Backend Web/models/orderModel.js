const pool = require('../config/database');
const cartModel = require('./cartModel');

const Order = {
    async getActiveOrderByUserId(userId) {
        try {
            const query = 'SELECT * FROM orders WHERE user_id = ? AND status != "completed"';
            const [data] = await pool.query(query, [userId]);
            return data[0] || null; // Kembalikan order pertama jika ada, null jika tidak
        } catch (error) {
            throw new Error('Could not get active order by user ID');
        }
    },

    async createNewOrder(userId) {
        try {
            const createOrderQuery = 'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, "pending")';
            const [result] = await pool.query(createOrderQuery, [userId, 0]);
            return { id: result.insertId, userId, status: "pending" };
        } catch (error) {
            throw new Error('Could not create new order');
        }
    },

    async getCartItemsByUserId(userId) {
        try {
            const carts = await cartModel.getCartByUserId(userId);
            const query = `
                SELECT fertilizer_id, quantity, price
                FROM cart_items
                WHERE cart_id = ? AND status = true
            `;
            const [data] = await pool.query(query, [carts.id]);
            return data;
        } catch (error) {
            throw new Error('Could not get cart items by user ID');
        }
    },

    async addToOrderFromCart(userId, cartItems) {
        try {
            // Cek apakah ada order aktif (status != "completed")
            let order = await this.getActiveOrderByUserId(userId);

            // Buat order baru jika tidak ada order aktif
            if (!order) {
                order = await this.createNewOrder(userId);
                console.log('New order created:', order);
            }

            // Tambahkan item ke order dan hitung total harga
            let totalPrice = 0;
            const addItemQuery = `
                INSERT INTO order_items (order_id, fertilizer_id, quantity, price)
                VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
                    quantity = quantity + VALUES(quantity),
                    price = VALUES(price)
            `;
            for (const item of cartItems) {
                const { fertilizer_id, quantity, price } = item;
                await pool.query(addItemQuery, [order.id, fertilizer_id, quantity, price]);
                totalPrice += quantity * parseFloat(price); // Pastikan harga di-convert ke float
            }

            // Update total harga pada order
            const updateOrderQuery = 'UPDATE orders SET total_price = ? WHERE id = ?';
            await pool.query(updateOrderQuery, [totalPrice, order.id]);

            return { orderId: order.id, totalPrice, orderStatus: order.status };
        } catch (error) {
            console.error('Error in addToOrderFromCart:', error.message);
            throw new Error('Could not add items to order');
        }
    },
};

module.exports = Order;
