const express = require('express');
const {
  addKategori,
  deleteKategori,
  updateKategori,
  getKategoriById,
  getAllKategori,
} = require('../controllers/kategoriController');
const { authMiddleware, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/tambah', authMiddleware, sellerOnly, addKategori); 
router.delete('/hapus/:id', authMiddleware, sellerOnly, deleteKategori); 
router.put('/edit/:id', authMiddleware, sellerOnly, updateKategori); 
router.get('/:id', authMiddleware, getKategoriById);
router.get('/', authMiddleware, getAllKategori);

module.exports = router;
