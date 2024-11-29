const pool = require('../config/database');

exports.addPupuk = async (req, res) => {
  const { name, description, price, category_id } = req.body;
  const imagePath = req.file ? req.file.filename : null;
  const sellerId = req.user.id; // Mendapatkan seller_id dari pengguna yang sedang login

  try {
    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [category_id]);
    if (!category.length) return res.status(404).json({ message: 'Category not found' });

    const [result] = await pool.query(
      'INSERT INTO fertilizers (name, description, price, image_path, category_id, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, imagePath, category_id, sellerId]
    );
    res.status(201).json({ message: 'Fertilizer created', fertilizerId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePupuk = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id; 

  try {
    const [fertilizer] = await pool.query('SELECT * FROM fertilizers WHERE id = ? AND seller_id = ?', [id, sellerId]);
    if (!fertilizer.length) return res.status(404).json({ message: 'Fertilizer not found or not authorized' });

    const [result] = await pool.query('DELETE FROM fertilizers WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Fertilizer not found' });
    
    res.status(200).json({ message: 'Fertilizer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePupuk = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, categoryId } = req.body;
  const imagePath = req.file ? req.file.filename : null;
  const sellerId = req.user.id; 

  try {
    // Cek apakah pupuk yang ingin diupdate milik seller yang sedang login
    const [fertilizer] = await pool.query('SELECT * FROM fertilizers WHERE id = ? AND seller_id = ?', [id, sellerId]);
    if (!fertilizer.length) return res.status(404).json({ message: 'Fertilizer not found or not authorized' });

    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    if (categoryId && !category.length) return res.status(404).json({ message: 'Category not found' });

    await pool.query(
      'UPDATE fertilizers SET name = ?, description = ?, price = ?, image_path = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name || fertilizer[0].name, description || fertilizer[0].description, price || fertilizer[0].price, imagePath || fertilizer[0].image_path, categoryId || fertilizer[0].category_id, id]
    );
    res.status(200).json({ message: 'Fertilizer updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPupukById = async (req, res) => {
  const { id } = req.params;
  try {
    const [fertilizer] = await pool.query('SELECT * FROM fertilizers WHERE id = ?', [id]);
    if (!fertilizer.length) return res.status(404).json({ message: 'Fertilizer not found' });
    res.status(200).json({ fertilizer: fertilizer[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPupuk = async (req, res) => {
  try {
    // Mengambil semua produk dari tabel fertilizers
    const [products] = await pool.query('SELECT * FROM fertilizers');

    console.log("Products found:", products); // Debugging: Cek apakah produk ada

    if (products.length === 0) {
      return res.status(404).json({ message: "Tidak ada produk yang ditemukan" });
    }

    // Mengembalikan data produk dalam format JSON
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


