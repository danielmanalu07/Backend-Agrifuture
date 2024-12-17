const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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


exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!users.length) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = users[0];

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword || !user.password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successfully",
      token: token,
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

exports.profileCustomer = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const verToken = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [verToken.id]);
    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    res.status(200).json({
      message: "success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profile_pic: user.profile_pic,
      }
    })
  } catch (error) {

  }
}

exports.logoutCustomer = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}