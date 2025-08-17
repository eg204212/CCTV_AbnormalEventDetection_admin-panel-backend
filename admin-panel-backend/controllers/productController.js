const Product = require('../models/Products');

// Create product
exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name || !description || !price || !image) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, description, price, and image are required fields'
            });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            image
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            status: 'success',
            data: savedProduct
        });
    } catch (error) {
        next(error);
    }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .sort({ dateCreated: -1 });

        res.status(200).json({
            status: 'success',
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Get single product
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
