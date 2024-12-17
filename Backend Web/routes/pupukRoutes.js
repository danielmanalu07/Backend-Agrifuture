const express = require('express');
const path = require('path');


const {
  addFertilizer,
  updateFertilizer,
  getAllFertilizers,
  getFertilizerById,
  deleteFertilizer,
  addStock,
} = require('../controllers/pupukController');
const { authMiddleware, sellerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/tambah', authMiddleware, sellerOnly, upload.single('image_path'), addFertilizer);
router.put('/edit/:id', authMiddleware, sellerOnly, upload.single('image_path'), updateFertilizer);
router.get('/',authMiddleware, getAllFertilizers);
router.get('/:id', getFertilizerById);
router.delete('/hapus/:id', authMiddleware, sellerOnly, deleteFertilizer);
router.put('/add-stock/:id', authMiddleware, sellerOnly, addStock);
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
