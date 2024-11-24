const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KategoriPupuk = sequelize.define('KategoriPupuk', {
  nama: { type: DataTypes.STRING, allowNull: false },
});

module.exports = KategoriPupuk;
