require('dotenv').config();
const express = require('express');
const initializeDatabase = require('./config/initDatabase');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const pupukRoutes = require('./routes/pupukRoutes');

initializeDatabase();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/pupuk', pupukRoutes);
// app.use('/uploads', express.static('uploads'));

// Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found!' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
