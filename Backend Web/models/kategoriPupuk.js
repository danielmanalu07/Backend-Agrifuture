const pool = require('../config/database');

const KategoriPupuk = {
  async create({ name, adminId, imagePath }) {
    const query = 'INSERT INTO categories (name, admin_id, image_path) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, adminId, imagePath]);
    return { id: result.insertId, name, adminId, imagePath };
  },

  async deleteById(id, adminId) {
    const queryCheck = 'SELECT * FROM categories WHERE id = ? AND admin_id = ?';
    const [kategori] = await pool.query(queryCheck, [id, adminId]);
    if (!kategori.length) throw new Error('Kategori not found or not authorized');

    const queryDelete = 'DELETE FROM categories WHERE id = ?';
    await pool.query(queryDelete, [id]);
  },

  async updateById(id, { name, adminId, imagePath }) {
    const queryCheck = 'SELECT * FROM categories WHERE id = ? AND admin_id = ?';
    const [kategori] = await pool.query(queryCheck, [id, adminId]);
    if (!kategori.length) throw new Error('Kategori not found or not authorized');

    const queryUpdate = `
      UPDATE categories 
      SET name = COALESCE(?, name), 
          image_path = COALESCE(?, image_path), 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await pool.query(queryUpdate, [name, imagePath, id]);
  },

  async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const [kategori] = await pool.query(query, [id]);
    if (!kategori.length) throw new Error('Kategori not found');
    return kategori[0];
  },

  async findAll() {
    const query = 'SELECT id, name, image_path, created_at, updated_at FROM categories';
    const [rows] = await pool.query(query);
    return rows;
  },
};

module.exports = KategoriPupuk;
