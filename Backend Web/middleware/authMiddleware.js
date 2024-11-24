const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan data pengguna yang terdekripsi
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.adminOnly = (req, res, next) => {
  const adminUsername = "admin"; 

  // Cek jika yang login adalah admin
  if (req.user.username !== adminUsername) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

exports.sellerOnly = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied, only sellers can access this' });
  }
  next();
};