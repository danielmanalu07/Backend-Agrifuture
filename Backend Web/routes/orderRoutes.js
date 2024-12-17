const express = require('express');
const { authMiddleware, customerOnly, sellerOnly } = require('../middleware/authMiddleware');
const { route } = require('./customerRoutes');
const OrderController = require('../controllers/orderController');
const router = express.Router();

router.post('/addToOrder', authMiddleware, customerOnly, OrderController.addToOrder);
router.get('/getOrder/seller', authMiddleware, sellerOnly, OrderController.getOrdersBySeller);
router.get("/order-detail/:orderId",authMiddleware, OrderController.getOrderDetail);

module.exports = router