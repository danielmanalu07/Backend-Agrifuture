const pool = require("../config/database");
const cartModel = require("./cartModel");

const Order = {
  async getActiveOrderByUserId(userId) {
    try {
      const query =
        'SELECT * FROM orders WHERE user_id = ? AND status != "completed"';
      const [data] = await pool.query(query, [userId]);
      return data[0] || null; // Kembalikan order pertama jika ada, null jika tidak
    } catch (error) {
      throw new Error("Could not get active order by user ID");
    }
  },

  async createNewOrder(userId) {
    try {
      const createOrderQuery =
        'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, "pending")';
      const [result] = await pool.query(createOrderQuery, [userId, 0]);
      return { id: result.insertId, userId, status: "pending" };
    } catch (error) {
      throw new Error("Could not create new order");
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
      throw new Error("Could not get cart items by user ID");
    }
  },

  async addToOrderFromCart(userId, cartItems) {
    try {
      // Cek apakah ada order aktif (status != "completed")
      let order = await this.getActiveOrderByUserId(userId);

      // Buat order baru jika tidak ada order aktif
      if (!order) {
        order = await this.createNewOrder(userId);
        console.log("New order created:", order);
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
        await pool.query(addItemQuery, [
          order.id,
          fertilizer_id,
          quantity,
          price,
        ]);
        totalPrice += quantity * parseFloat(price); // Pastikan harga di-convert ke float
      }

      // Update total harga pada order
      const updateOrderQuery = "UPDATE orders SET total_price = ? WHERE id = ?";
      await pool.query(updateOrderQuery, [totalPrice, order.id]);

      return { orderId: order.id, totalPrice, orderStatus: order.status };
    } catch (error) {
      console.error("Error in addToOrderFromCart:", error.message);
      throw new Error("Could not add items to order");
    }
  },

  // Fungsi untuk mendapatkan daftar order berdasarkan seller_id
  async getOrdersBySellerId(sellerId) {
    try {
      const query = `
            SELECT o.id AS order_id, 
                   o.total_price, 
                   o.status, 
                   o.created_at, 
                   oi.quantity, 
                   oi.price, 
                   f.name AS fertilizer_name
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN fertilizers f ON oi.fertilizer_id = f.id
            WHERE f.seller_id = ? AND o.status != 'completed'
            ORDER BY o.created_at DESC;
        `;
      const [orders] = await pool.query(query, [sellerId]);

      if (orders.length === 0) {
        return []; // Jika tidak ada pesanan
      }

      // Mengembalikan daftar pesanan sesuai format yang diinginkan
      return orders.map((order) => ({
        order_id: order.order_id,
        total_price: order.total_price,
        status: order.status,
        created_at: order.created_at,
        quantity: order.quantity,
        price: order.price,
        fertilizer_name: order.fertilizer_name,
      }));
    } catch (error) {
      console.error("Error getting orders by seller ID:", error.message);
      throw new Error("Could not get orders by seller ID");
    }
  },

  async getOrderDetailById(orderId) {
    try {
      const query = `
        SELECT 
            u.name AS buyer_name, 
            u.email AS buyer_email, 
            u.phone AS buyer_phone, 
            u.address AS buyer_address,
            f.name AS fertilizer_name,
            f.image_path AS fertilizer_image,
            oi.quantity,
            oi.price,
            o.total_price,
            o.status,
            o.created_at
        FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN fertilizers f ON oi.fertilizer_id = f.id
            JOIN users u ON o.user_id = u.id
        WHERE o.id = ?;
      `;
      const [orderDetails] = await pool.query(query, [orderId]);

      if (orderDetails.length === 0) {
        return null; // Jika tidak ada detail untuk orderId ini
      }

      // Mengembalikan hasil yang lebih terstruktur
      return orderDetails.map((order) => ({
        buyer_name: order.buyer_name,
        buyer_email: order.buyer_email,
        buyer_phone: order.buyer_phone,
        buyer_address: order.buyer_address,
        fertilizer_name: order.fertilizer_name,
        fertilizer_image: order.fertilizer_image, // Foto produk
        quantity: order.quantity,
        price: order.price,
        total_price: order.total_price,
        status: order.status,
        created_at: order.created_at,
      }));
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      throw new Error("Could not get order details");
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const query = `UPDATE orders SET status = ? WHERE id = ?`;
      const [result] = await pool.query(query, [status, orderId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Could not update order status");
    }
  },
};

module.exports = Order;
