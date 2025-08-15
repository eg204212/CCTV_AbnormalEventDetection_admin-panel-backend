const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: String,
  name: String,
  category: String,
  shortDescription: String,
  keyFeatures: [String],
  installationType: String,
  unitPrice: Number,
  warranty: String,
  detectableEvents: [String],
  imageUrl: String,
});

module.exports = mongoose.model('Product', productSchema);
