require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./config/initDatabase');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const pupukRoutes = require('./routes/pupukRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');
const bodyParser = require('body-parser');


// Inisialisasi database
initializeDatabase();

const app = express();

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/pupuk', pupukRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found!' });
});



// Jalankan server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
