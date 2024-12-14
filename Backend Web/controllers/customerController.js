const pool = require("../config/database");
const bcrypt = require("bcryptjs");

exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [existingEmail] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, phone, address, role, approved) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, address, "customer", false]
    );

    res.status(200).json({ message: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
