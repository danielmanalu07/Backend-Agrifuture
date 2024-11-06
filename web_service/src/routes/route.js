const express = require('express');
const AuthController = require('../controllers/authController');
const authenticateToken = require('../utils/authMiddleware');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authenticateToken, AuthController.profile);
router.post('/logout', authenticateToken, AuthController.logout);

module.exports = router;