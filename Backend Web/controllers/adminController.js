const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [admin] = await pool.query('SELECT * FROM users WHERE username = ? AND role = ?', [username, 'admin']);
    if (!admin.length) return res.status(404).json({ message: 'Admin not found' });

    const validPassword = await bcrypt.compare(password, admin[0].password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin[0].id, username: admin[0].username, role: admin[0].role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout Admin
exports.logoutAdmin = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Seller Approval
exports.updateSellerApproval = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;  
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'seller']);

    if (!user.length) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    await pool.query(
      `UPDATE users SET approved = ? WHERE id = ? AND role = 'seller'`,
      [approved, id]
    );

    res.status(200).json({ message: `Seller approval ${approved ? 'approved' : 'denied'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Seller By ID
exports.getSellerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [seller] = await pool.query('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'seller']);
    if (!seller.length) return res.status(404).json({ message: 'Seller not found' });
    res.status(200).json({ seller: seller[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Sellers
exports.getAllSellers = async (req, res) => {
  try {
    const [sellers] = await pool.query('SELECT * FROM users WHERE role = "seller"');
    res.status(200).json({ sellers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
