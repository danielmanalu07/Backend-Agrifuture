const pool = require('../config/database');

// Tambah pupuk
exports.createFertilizer = async (data) => {
  const query = `
    INSERT INTO fertilizers (name, description, price, category_id, seller_id, image_path, stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.name,
    data.description,
    data.price,
    data.category_id,
    data.seller_id,
    data.image_path,
    data.stock || 0,
  ];
  const [result] = await pool.query(query, values);
  return result.insertId;
};

// Update pupuk
exports.updateFertilizer = async (id, data) => {
  const fields = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  const query = `
    UPDATE fertilizers 
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;

  values.push(id);
  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

// Ambil semua pupuk
exports.getAllFertilizers = async (filters = {}) => {
  try {
    let query = "SELECT * FROM fertilizers";
    const queryParams = [];

    if (filters.seller_id) {
      query += " WHERE seller_id = ?";
      queryParams.push(filters.seller_id);
    }

    const [rows] = await pool.query(query, queryParams);
    return rows;
  } catch (err) {
    throw new Error("Failed to fetch fertilizers: " + err.message);
  }
};

// Ambil pupuk berdasarkan ID
exports.getFertilizerById = async (id) => {
  const query = 'SELECT * FROM fertilizers WHERE id = ?';
  const [rows] = await pool.query(query, [id]);
  return rows[0] || null;
};

// Hapus pupuk
exports.deleteFertilizer = async (id) => {
  const query = 'DELETE FROM fertilizers WHERE id = ?';
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
};

//Tambah stok pupuk
exports.updateStock = async (id, addedStock) => {
  try {
    const query = `
      UPDATE fertilizers
      SET stock = stock + ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [addedStock, id]);

    if (result.affectedRows === 0) {
      throw new Error("Fertilizer not found");
    }

    return true;
  } catch (err) {
    throw new Error("Failed to update stock: " + err.message);
  }
};