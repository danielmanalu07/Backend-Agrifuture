// adminRoutes.js
const express = require('express');
const path = require('path');
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
router.get('/seller/:id',authMiddleware, getSellerById);
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Get all sellers
router.get('/sellers', authMiddleware, adminOnly, getAllSellers);

module.exports = router;
