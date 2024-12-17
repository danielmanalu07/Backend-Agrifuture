const express = require('express');
const { authMiddleware, customerOnly } = require('../middleware/authMiddleware');
const { route } = require('./customerRoutes');
const OrderController = require('../controllers/orderController');
const router = express.Router();

router.post('/adddToOrder', authMiddleware, customerOnly, OrderController.addToOrder);
router.get('/myOrder', authMiddleware, customerOnly, OrderController.getOrderItemByUser);

module.exports = router