const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const KategoriPupuk = require('./kategoriPupuk');

const Pupuk = sequelize.define('Pupuk', {
  nama: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  harga: { type: DataTypes.FLOAT, allowNull: false },
  gambar: { type: DataTypes.STRING },
  kategoriId: {
    type: DataTypes.INTEGER,
    references: {
      model: KategoriPupuk,
      key: 'id',
    },
  },
});

Pupuk.belongsTo(KategoriPupuk, { foreignKey: 'kategoriId' });
KategoriPupuk.hasMany(Pupuk, { foreignKey: 'kategoriId' });

module.exports = Pupuk;
