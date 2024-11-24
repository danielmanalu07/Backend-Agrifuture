const express = require('express');
const { 
  updateSellerApproval, 
  getSellerById, 
  getAllSellers, 
  loginAdmin, 
  logoutAdmin 
} = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Login dan Logout Admin
router.post('/login', loginAdmin);
router.post('/logout', authMiddleware, adminOnly, logoutAdmin);

router.put('/approve/seller/:id', authMiddleware, adminOnly, updateSellerApproval);
router.get('/seller/:id', authMiddleware, adminOnly, getSellerById);
router.get('/seller', authMiddleware, adminOnly, getAllSellers);

module.exports = router;
