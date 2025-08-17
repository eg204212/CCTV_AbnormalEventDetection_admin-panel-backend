const ProductAttribute = require('../models/ProductAttributes');

// Create attribute
exports.createAttribute = async (req, res, next) => {
    try {
        const { name, value, product } = req.body;
        
        if (!name || !value || !product) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, value, and product are required fields'
            });
        }

        const newAttribute = new ProductAttribute({
            name,
            value,
            product
        });

        const savedAttribute = await newAttribute.save();
        res.status(201).json({
            status: 'success',
            data: savedAttribute
        });
    } catch (error) {
        next(error);
    }
};

// Get all attributes
exports.getAllAttributes = async (req, res, next) => {
    try {
        const attributes = await ProductAttribute.find()
            .populate('product')
            .sort({ dateCreated: -1 });
            
        res.status(200).json({
            status: 'success',
            count: attributes.length,
            data: attributes
        });
    } catch (error) {
        next(error);
    }
};

// Get single attribute
exports.getAttribute = async (req, res, next) => {
    try {
        const attribute = await ProductAttribute.findById(req.params.id)
            .populate('product');

        if (!attribute) {
            return res.status(404).json({
                status: 'error',
                message: 'Attribute not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: attribute
        });
    } catch (error) {
        next(error);
    }
};

// Update attribute
exports.updateAttribute = async (req, res, next) => {
    try {
        const attribute = await ProductAttribute.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!attribute) {
            return res.status(404).json({
                status: 'error',
                message: 'Attribute not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: attribute
        });
    } catch (error) {
        next(error);
    }
};

// Delete attribute
exports.deleteAttribute = async (req, res, next) => {
    try {
        const attribute = await ProductAttribute.findByIdAndDelete(req.params.id);

        if (!attribute) {
            return res.status(404).json({
                status: 'error',
                message: 'Attribute not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Attribute deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};