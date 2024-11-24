const pool = require('../config/database');

exports.addKategori = async (req, res) => {
  const { name } = req.body;
  const adminId = req.user.id; // Mendapatkan admin_id dari pengguna yang sedang login

  try {
    const [result] = await pool.query('INSERT INTO categories (name, admin_id) VALUES (?, ?)', [name, adminId]);
    res.status(201).json({ message: 'Kategori created', kategoriId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteKategori = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id; // Mendapatkan admin_id dari pengguna yang sedang login

  try {
    // Cek apakah kategori yang ingin dihapus milik admin yang sedang login
    const [kategori] = await pool.query('SELECT * FROM categories WHERE id = ? AND admin_id = ?', [id, adminId]);
    if (!kategori.length) {
      return res.status(404).json({ message: 'Kategori not found or not authorized' });
    }

    // Hapus kategori
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kategori not found' });
    }

    res.status(200).json({ message: 'Kategori deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateKategori = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const adminId = req.user.id; // Mendapatkan admin_id dari pengguna yang sedang login

  try {
    // Cek apakah kategori yang ingin diupdate milik admin yang sedang login
    const [kategori] = await pool.query('SELECT * FROM categories WHERE id = ? AND admin_id = ?', [id, adminId]);
    if (!kategori.length) {
      return res.status(404).json({ message: 'Kategori not found or not authorized' });
    }

    // Update kategori
    await pool.query('UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name || kategori[0].name, id]);
    res.status(200).json({ message: 'Kategori updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getKategoriById = async (req, res) => {
  const { id } = req.params;
  try {
    const [kategori] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (!kategori.length) return res.status(404).json({ message: 'Kategori not found' });
    res.status(200).json({ kategori: kategori[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllKategori = async (req, res) => {
  try {
    const [kategori] = await pool.query('SELECT * FROM categories');
    res.status(200).json({ kategori });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
