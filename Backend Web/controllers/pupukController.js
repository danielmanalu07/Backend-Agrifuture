const {
  createFertilizer,
  updateFertilizer,
  getAllFertilizers,
  getFertilizerById,
  deleteFertilizer,
} = require('../models/pupuk');

exports.addFertilizer = async (req, res) => {
  const { name, description, price, category_id, stock } = req.body;
  const seller_id = req.user.id;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const id = await createFertilizer({ name, description, price, category_id, seller_id, image_path, stock });
    res.status(201).json({ message: 'Fertilizer created', fertilizerId: id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFertilizer = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id, stock } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const currentFertilizer = await getFertilizerById(id);
    if (!currentFertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }

    const updated = await updateFertilizer(id, {
      name: name || currentFertilizer.name,
      description: description || currentFertilizer.description,
      price: price || currentFertilizer.price,
      category_id: category_id || currentFertilizer.category_id,
      stock: stock || currentFertilizer.stock,
      image_path: image_path || currentFertilizer.image_path,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Fertilizer not found or not authorized' });
    }

    res.status(200).json({ message: 'Fertilizer updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFertilizers = async (req, res) => {
  try {
    const fertilizers = await getAllFertilizers();
    res.status(200).json(fertilizers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFertilizerById = async (req, res) => {
  const { id } = req.params;
  try {
    const fertilizer = await getFertilizerById(id);
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    res.status(200).json(fertilizer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFertilizer = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteFertilizer(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    res.status(200).json({ message: 'Fertilizer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
