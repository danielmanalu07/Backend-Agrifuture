const express = require('express');
const { login, logout, register, updateSellerProfile } = require('../controllers/sellerController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to register a new seller
router.post('/register', register);

// Route to login a seller
router.post('/login', login);

// Route to logout a seller (authentication required)
router.post('/logout', authMiddleware, logout);

// Route to update seller profile (authentication required)
router.put('/edit-profile', authMiddleware, upload.single('profile_pic'), updateSellerProfile);

module.exports = router;
