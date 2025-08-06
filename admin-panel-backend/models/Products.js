const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  features: [String],
  imageUrl: String,
});

module.exports = mongoose.model('Product', productSchema);
