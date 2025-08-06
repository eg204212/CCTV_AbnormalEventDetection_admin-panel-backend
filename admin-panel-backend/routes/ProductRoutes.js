const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Products.js');

// Image storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Add product route
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description, features } = req.body;
    const image = req.file ? req.file.filename : '';

    const product = new Product({
      name,
      description,
      imageUrl: image,
      features: features.split(',').map(f => f.trim()),
    });

    await product.save();
    res.status(201).json({ message: 'Product saved', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, features } = req.body;
    const image = req.file ? req.file.filename : null;

    const updatedData = {
      name,
      description,
      features: features.split(',').map(f => f.trim()),
    };

    if (image) updatedData.imageUrl = image;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
