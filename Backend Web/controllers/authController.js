const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, position: user.position }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    res.status(500).json({ message: 'Gagal login', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout berhasil' });
};