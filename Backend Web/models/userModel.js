// userModel.js (example with MySQL)
const pool = require('../config/database'); // Sesuaikan dengan database yang digunakan

// Get seller by ID
exports.getSellerById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Get all sellers
exports.getAllSellers = async () => {
  const [rows] = await pool.query('SELECT * FROM users WHERE role = "seller"');
  return rows;
};

// Update seller approval status
exports.updateSellerApproval = async (id, approved) => {
  await pool.query('UPDATE users SET approved = ? WHERE id = ?', [approved, id]);
};

// Update seller profile
exports.updateProfile = async (id, updatedFields) => {
  // We dynamically create the SQL query based on updated fields
  let query = 'UPDATE users SET ';
  const values = [];

  // Loop through the updatedFields object and add columns that have changed
  for (const key in updatedFields) {
    if (updatedFields[key] !== undefined) {
      query += `${key} = ?, `;
      values.push(updatedFields[key]);
    }
  }

  // Remove the last comma and space
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  values.push(id); // Add the seller ID as the last value for the WHERE clause

  // Execute the query
  await pool.query(query, values);
};
