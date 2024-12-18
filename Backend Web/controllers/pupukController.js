const {
  createFertilizer,
  updateFertilizer,
  getAllFertilizers,
  getFertilizerById,
  deleteFertilizer,
  updateStock
} = require('../models/pupuk');
const adminModel = require('../models/userModel'); // Importing user model

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
    const user = req.user || {}; // Jika tidak ada user, req.user akan undefined
    const { role, id: seller_id } = user; // Ambil role dan seller_id jika ada

    let fertilizers;
    if (role === "seller") {
      // Seller hanya melihat data pupuk miliknya
      fertilizers = await getAllFertilizers({ seller_id });
    } else {
      // Tanpa token, atau role customer/admin melihat semua pupuk
      const allFertilizers = await getAllFertilizers();

      // Tambahkan data seller ke setiap pupuk
      fertilizers = await Promise.all(
        allFertilizers.map(async (item) => {
          const seller = await adminModel.getSellerById(item.seller_id); // Ambil seller berdasarkan seller_id
          return {
            ...item,        // Data pupuk
            seller, // Tambahkan informasi seller
          };
        })
      );
    }

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
    const seller = await adminModel.getSellerById(fertilizer.seller_id);

    // Menggabungkan data fertilizer dengan data seller
    const dataWithSeller = {
      ...fertilizer,
      seller,
    };

    res.status(200).json(dataWithSeller);
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

exports.addStock = async (req, res) => {
  const { id } = req.params; // ID produk
  const { addedStock } = req.body; // Jumlah stok yang akan ditambahkan

  if (!addedStock || isNaN(addedStock) || addedStock <= 0) {
    return res.status(400).json({ message: "Invalid stock value" });
  }

  try {
    const success = await updateStock(id, parseInt(addedStock, 10)); // Gunakan updateStock dari model
    if (!success) {
      return res.status(404).json({ message: "Fertilizer not found" });
    }

    res.status(200).json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
