const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const {
    name,
    store_name,
    phone,
    address,
    birth_date,
    email,
    gender,
    username,
    password,
  } = req.body;

  try {
    // Check if username already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if email already exists
    const [existingEmail] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the users table
    const [result] = await pool.query(
      "INSERT INTO users (name, store_name, phone, address, birth_date, email, gender, username, password, role, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        store_name,
        phone,
        address,
        birth_date,
        email,
        gender,
        username,
        hashedPassword,
        "seller",
        false,
      ] // Default to unapproved and seller role
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (!user.length || !(await bcrypt.compare(password, user[0].password)) || !user[0].approved) {
      return res.status(401).json({ message: "Invalid credentials or user not approved" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout seller
exports.logout = (req, res) => {
  // Jika menggunakan JWT, Anda bisa menghapus token di sisi klien (misalnya dengan menghapus cookie atau localStorage)
  res.clearCookie('token'); // Menghapus cookie token jika menggunakan cookie
  // atau jika menggunakan session, pastikan sesi dihapus di server

  res.status(200).json({ message: 'Logout successful' });
};

// Update seller profile
exports.updateSellerProfile = async (req, res) => {
  const { id } = req.user; // Ambil ID seller dari token
  const { name, email, phone, address, password } = req.body;
  const profilePic = req.file ? req.file.filename : null; // Menyimpan nama file gambar

  try {
    const [seller] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (seller.length === 0) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Cek apakah akun seller disetujui
    if (seller[0].approved === 0) {
      return res.status(403).json({ message: 'Your account is not approved yet' });
    }

    // Hash password jika disertakan
    const hashedPassword = password ? await bcrypt.hash(password, 10) : seller[0].password;

    // Update seller profile
    await pool.query(
      `UPDATE users SET 
         name = ?, email = ?, phone = ?, address = ?, password = ?, 
         profile_pic = ? 
       WHERE id = ?`,
      [
        name || seller[0].name, 
        email || seller[0].email, 
        phone || seller[0].phone, 
        address || seller[0].address, 
        hashedPassword, 
        profilePic || seller[0].profile_pic, // Jika ada foto baru, simpan nama file-nya
        id
      ]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
