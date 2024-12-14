const express = require('express');
const path = require('path')
const router = express.Router();
const {
  addKategori,
  getKategoriById,
  getAllKategori,
  updateKategori,
  deleteKategori,
} = require('../controllers/kategoriController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/tambah', authMiddleware, adminOnly, upload.single('image'), addKategori);
router.get('/:id', getKategoriById);
router.get('/', getAllKategori);
router.put('/edit/:id', authMiddleware, adminOnly, upload.single('image'), updateKategori);
router.delete('/hapus/:id', authMiddleware, adminOnly, deleteKategori);
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
