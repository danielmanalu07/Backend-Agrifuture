const express = require('express');
const {
  addFertilizer,
  updateFertilizer,
  getAllFertilizers,
  getFertilizerById,
  deleteFertilizer,
} = require('../controllers/pupukController');
const { authMiddleware, sellerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/tambah', authMiddleware, sellerOnly, upload.single('image_path'), addFertilizer);
router.put('/edit/:id', authMiddleware, sellerOnly, upload.single('image_path'), updateFertilizer);
router.get('/', authMiddleware, getAllFertilizers);
router.get('/:id', authMiddleware, getFertilizerById);
router.delete('/hapus/:id', authMiddleware, sellerOnly, deleteFertilizer);

module.exports = router;
