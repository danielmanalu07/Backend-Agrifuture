// AdminController.js
const adminModel = require('../models/userModel'); // Importing user model
const pool = require('../config/database'); 

// Approve/deny seller
exports.updateSellerApproval = async (req, res) => {
  const { id } = req.params; // ID dari parameter
  const { approved } = req.body; // Status persetujuan dari body

  try {
    const query = "UPDATE users SET approved = ? WHERE id = ?";
    await pool.query(query, [approved, id]);

    res.status(200).json({ message: "Seller approval updated successfully!" });
  } catch (err) {
    console.error("Error updating seller approval:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get seller by ID
exports.getSellerById = async (req, res) => {
  const { id } = req.params;
  try {
    const seller = await adminModel.getSellerById(id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await adminModel.getAllSellers();
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
