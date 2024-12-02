const pool = require("./database");
const bcrypt = require("bcryptjs");

const createTables = async () => {
  try {
    // Tabel users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        store_name VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        birth_date DATE,
        email VARCHAR(255) UNIQUE,
        gender ENUM('male', 'female'),
        profile_pic TEXT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'seller') NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabel kategori_pupuk
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        admin_id INT,
        image_path VARCHAR(255) NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Tabel pupuk
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fertilizers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    seller_id INT,
    image_path VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
    `);

    console.log("Database tables created or already exist.");
  } catch (err) {
    console.error("Error creating tables:", err.message);
  }
};

const seedAdmin = async () => {
  const username = "admin";
  const name = "admin agrifuture";
  const password = await bcrypt.hash("admin123", 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (name, username, password, role, approved) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=username",
      [name, username, password, "admin", true]
    );
    console.log("Admin seeded successfully");
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  }
};

const initializeDatabase = async () => {
  await createTables();
  await seedAdmin();
};

module.exports = initializeDatabase;
