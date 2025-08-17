const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,  // Duration in months
        required: true,
        min: 1
    },
    features: [{
        type: String,
        required: true
    }],
    isPopular: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

subscriptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
