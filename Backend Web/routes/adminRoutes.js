// adminRoutes.js
const express = require('express');
const {
  updateSellerApproval,
  getSellerById,
  getAllSellers
} = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Update approval status seller
router.put('/approve/seller/:id', authMiddleware, adminOnly, updateSellerApproval);

// Get seller by ID
router.get('/seller/:id', getSellerById);

// Get all sellers
router.get('/sellers', authMiddleware, adminOnly, getAllSellers);

module.exports = router;
