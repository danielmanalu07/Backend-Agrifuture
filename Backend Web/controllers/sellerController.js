// SellerController.js
const sellerModel = require('../models/userModel'); // Importing user model
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Update seller profile
exports.updateSellerProfile = async (req, res) => {
  const { id } = req.user; // Get the seller ID from the token
  const { name, store_name, email, phone, address, gender, password } = req.body;
  const profilePic = req.file ? req.file.filename : null; // Save filename if a new image is uploaded

  try {
    const seller = await sellerModel.getSellerById(id); // Get the seller by ID
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Check if the seller is approved
    if (!seller.approved) {
      return res.status(403).json({ message: 'Your account is not approved yet' });
    }

    // If password is provided, hash it, otherwise keep the current password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Prepare fields to update, ensuring only provided fields are updated
    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (store_name) updatedFields.store_name = store_name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
    if (address) updatedFields.address = address;
    if (gender) updatedFields.gender = gender;
    if (hashedPassword) updatedFields.password = hashedPassword;
    if (profilePic) updatedFields.profile_pic = profilePic;

    // If no fields to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Update only the fields that have changed
    await sellerModel.updateProfile(id, updatedFields);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
