const express = require('express');
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
router.get('/:id', authMiddleware, getKategoriById);
router.get('/', authMiddleware, getAllKategori);
router.put('/edit/:id', authMiddleware, adminOnly, upload.single('image'), updateKategori);
router.delete('/hapus/:id', authMiddleware, adminOnly, deleteKategori);

module.exports = router;
