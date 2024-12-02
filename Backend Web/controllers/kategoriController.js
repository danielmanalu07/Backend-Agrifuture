const KategoriPupuk = require('../models/kategoriPupuk');

exports.addKategori = async (req, res) => {
  const { name } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const adminId = req.user.id;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const kategori = await KategoriPupuk.create({
      name,
      adminId,
      imagePath,
    });

    res.status(201).json({ message: 'Kategori created successfully', kategori });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Kategori name must be unique' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.deleteKategori = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  try {
    await KategoriPupuk.deleteById(id, adminId);
    res.status(200).json({ message: 'Kategori deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateKategori = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const adminId = req.user.id;

  try {
    await KategoriPupuk.updateById(id, { name, adminId, imagePath });
    res.status(200).json({ message: 'Kategori updated successfully' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getKategoriById = async (req, res) => {
  const { id } = req.params;

  try {
    const kategori = await KategoriPupuk.findById(id);
    res.status(200).json({ kategori });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getAllKategori = async (req, res) => {
  try {
    const kategori = await KategoriPupuk.findAll();
    res.status(200).json({ success: true, kategori });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
