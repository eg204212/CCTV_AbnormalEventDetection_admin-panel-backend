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

// Add product
// Add product
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      productCode,
      name,
      category,
      shortDescription,
      keyFeatures,
      installationType,
      unitPrice,
      warranty,
      detectableEvents
    } = req.body;

    const image = req.file ? req.file.filename : '';

    const parsedKeyFeatures = (() => {
      if (!keyFeatures) return [];
      if (Array.isArray(keyFeatures)) return keyFeatures;
      return keyFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0);
    })();

    const parsedDetectableEvents = (() => {
      if (!detectableEvents) return [];
      if (Array.isArray(detectableEvents)) return detectableEvents;
      return detectableEvents.split(',').map(e => e.trim()).filter(e => e.length > 0);
    })();

    const product = new Product({
      productCode,
      name,
      category,
      shortDescription,
      keyFeatures: parsedKeyFeatures,
      installationType,
      unitPrice,
      warranty,
      detectableEvents: parsedDetectableEvents,
      imageUrl: image
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
    const {
      productCode,
      name,
      category,
      shortDescription,
      keyFeatures,
      installationType,
      unitPrice,
      warranty,
      detectableEvents
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const parsedKeyFeatures = (() => {
      if (!keyFeatures) return [];
      if (Array.isArray(keyFeatures)) return keyFeatures;
      return keyFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0);
    })();

    const parsedDetectableEvents = (() => {
      if (!detectableEvents) return [];
      if (Array.isArray(detectableEvents)) return detectableEvents;
      return detectableEvents.split(',').map(e => e.trim()).filter(e => e.length > 0);
    })();

    const updatedData = {
      productCode,
      name,
      category,
      shortDescription,
      keyFeatures: parsedKeyFeatures,
      installationType,
      unitPrice,
      warranty,
      detectableEvents: parsedDetectableEvents
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
