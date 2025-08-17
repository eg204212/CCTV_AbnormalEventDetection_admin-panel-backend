const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Import routes
const productRoutes = require('./routes/ProductRoutes.js');
const productAttributeRoutes = require('./routes/productAttributeRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// API routes
app.use('/api/product', productRoutes);
app.use('/api/product-attributes', productAttributeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));