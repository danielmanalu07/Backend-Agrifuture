// SellerController.js
const sellerModel = require('../models/userModel'); // Importing user model

// Update seller profile
exports.updateSellerProfile = async (req, res) => {
  const { id } = req.user; // Get the seller ID from the token
  const { name, email, phone, address, password } = req.body;
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

    // If password is provided, hash it, otherwise use the existing password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : seller.password;

    // Prepare fields to update
    const updatedFields = {
      name: name || seller.name,
      email: email || seller.email,
      phone: phone || seller.phone,
      address: address || seller.address,
      password: hashedPassword,
      profile_pic: profilePic || seller.profile_pic
    };

    // Update only the fields that have changed
    await sellerModel.updateProfile(id, updatedFields);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};