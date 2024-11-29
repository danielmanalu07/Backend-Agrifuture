require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./config/initDatabase');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const pupukRoutes = require('./routes/pupukRoutes');

// Inisialisasi database
initializeDatabase();

const app = express();

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/pupuk', pupukRoutes);

// Error Handling Middleware untuk route yang tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found!' });
});

// Jalankan server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
