const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Indexes for better query performance
productAttributeSchema.index({ product: 1 });
productAttributeSchema.index({ name: 1 });

const ProductAttribute = mongoose.model('ProductAttribute', productAttributeSchema);

module.exports = ProductAttribute;