// AuthController.js
const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register
exports.register = async (req, res) => {
  const { name, store_name, phone, address, birth_date, email, gender, username, password } = req.body;
  try {
    // Check if username already exists
    const [existingUser] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if email already exists
    const [existingEmail] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
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
    const [user] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
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

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token'); // Clear token from client-side (cookie, localStorage, etc.)
  res.status(200).json({ message: 'Logout successful' });
};
