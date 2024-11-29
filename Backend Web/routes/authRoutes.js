const express = require('express');
const { getProfile, login, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;