const express = require('express');
const { registerCustomer, loginCustomer, profileCustomer, logoutCustomer } = require('../controllers/customerController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/profile', authMiddleware, profileCustomer);
router.get('/logout', authMiddleware, logoutCustomer);

module.exports = router;