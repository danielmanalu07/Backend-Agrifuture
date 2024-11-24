const express = require('express');
const {
  addKategori,
  deleteKategori,
  updateKategori,
  getKategoriById,
  getAllKategori,
} = require('../controllers/kategoriController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/tambah', authMiddleware, adminOnly, addKategori); 
router.delete('/hapus/:id', authMiddleware, adminOnly, deleteKategori); 
router.put('/edit/:id', authMiddleware, adminOnly, updateKategori); 
router.get('/:id', authMiddleware, getKategoriById);
router.get('/', authMiddleware, getAllKategori);

module.exports = router;
