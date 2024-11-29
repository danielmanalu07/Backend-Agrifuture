const express = require('express');
const router = express.Router();
const { 
  getAllKategori, 
  getKategoriById, 
  addKategori, 
  updateKategori, 
  deleteKategori 
} = require('../controllers/kategoriController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllKategori);
router.get('/:id', authMiddleware, getKategoriById);
router.post('/tambah', authMiddleware, adminOnly, addKategori);
router.put('/edit/:id', authMiddleware, adminOnly, updateKategori);
router.delete('/hapus/:id', authMiddleware, adminOnly, deleteKategori);

module.exports = router;