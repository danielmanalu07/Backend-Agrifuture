// AuthController.js
const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register
exports.register = async (req, res) => {
  const { name, store_name, phone, address, birth_date, email, gender, username, password } = req.body;
  try {
    const [existingUser] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const [existingEmail] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingEmail.length) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari pengguna berdasarkan username
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    // Jika username tidak ditemukan
    if (!users.length) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = users[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid || !user.approved) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Sertakan role dalam payload JWT
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token berlaku selama 1 hari
    );

    // Kirim respons dengan token dan role
    res.status(200).json({
      success: true,
      token,
      role: user.role, // Tambahkan role ke respons
      username: user.username // Opsional, jika username diperlukan
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout
exports.logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET);

    // Jika token valid, proses logout
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.getProfile = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    
    // Calculate the age from birth_date
    const birthDate = new Date(user.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // If the current month is before the birth month, subtract 1 from the age
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const profilePicUrl = user.profile_pic
      ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
      : null;

    res.status(200).json({
      username: user.username,
      name: user.name,
      store_name: user.store_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      age: age, // The calculated age
      gender: user.gender,
      joinedDate: user.created_at,
      profilePic: profilePicUrl,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
