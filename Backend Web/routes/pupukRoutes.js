const express = require('express');
const {
  addPupuk,
  deletePupuk,
  updatePupuk,
  getPupukById,
  getAllPupuk,
} = require('../controllers/pupukController');
const { authMiddleware, sellerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/tambah', authMiddleware, sellerOnly,upload.single('image_path'), addPupuk);
router.delete('/hapus/:id', authMiddleware,sellerOnly, deletePupuk);
router.put('/edit/:id', authMiddleware,sellerOnly, upload.single('image_path'), updatePupuk);
router.get('/:id', authMiddleware, getPupukById);
router.get('/', authMiddleware, getAllPupuk);

module.exports = router;
