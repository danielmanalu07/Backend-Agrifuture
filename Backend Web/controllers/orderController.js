
const orderModel = require('../models/orderModel');
const fertilizerModel = require('../models/pupuk');

const orderModel = require("../models/orderModel");

class OrderController {
    static async addToOrder(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized: User ID not found" });
            }

            const cartItems = await orderModel.getCartItemsByUserId(userId);

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ message: 'No items in cart with status true' });
            }
            if (!cartItems || cartItems.length === 0) {
                return res
                    .status(400)
                    .json({ message: "No items in cart with status true" });
            }
            console.log("Cart Items : ", cartItems);

            const result = await orderModel.addToOrderFromCart(userId, cartItems);

            res.status(200).json({
                message: "Order created successfully",
                order: {
                    id: result.orderId,
                    totalPrice: result.totalPrice,
                    status: result.orderStatus,
                },
            });
        } catch (error) {
            console.error("Error creating order:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
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

    // Fungsi untuk seller melihat daftar order berdasarkan seller_id
    static async getOrdersBySeller(req, res) {
        try {
            const sellerId = req.user?.id; // Seller ID diambil dari token pengguna
            if (!sellerId) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized: Seller ID not found" });
            }

            // Panggil fungsi model untuk mendapatkan pesanan berdasarkan seller ID
            const orders = await orderModel.getOrdersBySellerId(sellerId);

            if (!orders || orders.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No orders found for this seller" });
            }

            // Kirimkan respons dengan hanya data yang relevan
            res.status(200).json(orders);
        } catch (error) {
            console.error("Error retrieving orders for seller:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    }
    static async getOrderDetail(req, res) {
        try {
            const { orderId } = req.params;

            const orderDetails = await orderModel.getOrderDetailById(orderId);

            if (!orderDetails) {
                return res.status(404).json({ message: "Order not found" });
            }

            res.status(200).json(orderDetails);
        } catch (error) {
            console.error("Error fetching order details:", error.message);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

}

module.exports = OrderController;
