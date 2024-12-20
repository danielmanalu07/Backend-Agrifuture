const express = require('express');
const { authMiddleware, customerOnly, sellerOnly } = require('../middleware/authMiddleware');
const { route } = require('./customerRoutes');
const OrderController = require('../controllers/orderController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/adddToOrder', authMiddleware, customerOnly, OrderController.addToOrder);
router.get('/myOrder', authMiddleware, customerOnly, OrderController.getOrderItemByUser);
router.get('/myOrderPending', authMiddleware, customerOnly, OrderController.getOrderPendingByUser);
router.post('/addToOrder', authMiddleware, customerOnly, OrderController.addToOrder);
router.get('/getOrder/seller', authMiddleware, sellerOnly, OrderController.getOrdersBySeller);
router.get("/order-detail/:orderId", authMiddleware, OrderController.getOrderDetail);
router.put("/:id/payment-proof", authMiddleware, customerOnly, upload.single('payment_proof'), OrderController.paymentProof);

module.exports = router