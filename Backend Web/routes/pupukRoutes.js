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

// Tambah Pupuk
router.post(
  '/tambah',
  authMiddleware,
  sellerOnly,
  upload.single('image_path'),
  (req, res, next) => {
    if (!req.file) {
      console.error("File tidak ditemukan dalam request!");
      return res.status(400).json({ message: 'File is required' });
    }
    req.body.image_path = `/uploads/${req.file.filename}`; // Set path gambar
    next();
  },
  addPupuk
);

// Hapus Pupuk
router.delete('/hapus/:id', authMiddleware, sellerOnly, deletePupuk);

// Update Pupuk
router.put(
  '/edit/:id',
  authMiddleware,
  sellerOnly,
  upload.single('image_path'),
  (req, res, next) => {
    if (req.file) {
      req.body.image_path = `/uploads/${req.file.filename}`; // Perbarui path gambar jika file baru diupload
    }
    next();
  },
  updatePupuk
);

// Get Pupuk by ID
router.get('/:id', authMiddleware, getPupukById);

// Get All Pupuk
router.get('/',authMiddleware, getAllPupuk);

module.exports = router;
