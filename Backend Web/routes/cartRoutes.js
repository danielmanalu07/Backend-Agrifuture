const express = require('express');
const cartController = require('../controllers/cartController');
const { authMiddleware, customerOnly } = require('../middleware/authMiddleware');
const { route } = require('./customerRoutes');
const router = express.Router();

router.post('/addToCart', authMiddleware, customerOnly, cartController.addToCart);
router.patch('/cart-items/:cartItemId/status', authMiddleware, customerOnly, cartController.updateStatus);
router.patch('/cart-items/:cartItemId/quantity', authMiddleware, customerOnly, cartController.updateQuantity);

module.exports = router;
