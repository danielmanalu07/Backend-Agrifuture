const express = require('express');
const {  updateSellerProfile } = require('../controllers/sellerController');
const {register} = require('../controllers/authController')
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', register)
// Route to update seller profile (authentication required)
router.put('/edit-profile', authMiddleware, upload.single('profile_pic'), updateSellerProfile);

module.exports = router;
