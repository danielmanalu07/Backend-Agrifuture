const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    // If no token, set req.user to null so the next middleware can handle it
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set the decoded user data to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};


exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

exports.sellerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No user found, please login." });
  }
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Forbidden: You are not authorized." });
  }
  next();
};

exports.customerOnly = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access denied, only customers can access this' });
  }
  next();
}