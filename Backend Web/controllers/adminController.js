// AdminController.js
const adminModel = require('../models/userModel'); // Importing user model

// Approve/deny seller
exports.updateSellerApproval = async (req, res) => {
  const { id } = req.params; // Get seller ID from URL params
  const { approved } = req.body; // Approved status (true or false)

  try {
    const seller = await adminModel.getSellerById(id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Update seller approval status in the database
    await adminModel.updateSellerApproval(id, approved);

    res.status(200).json({ message: `Seller approval ${approved ? 'approved' : 'denied'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
