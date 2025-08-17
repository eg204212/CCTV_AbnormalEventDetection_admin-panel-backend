const Subscription = require('../models/Subscription');

// Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({ price: 1 });
        res.status(200).json({
            status: 'success',
            data: subscriptions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single subscription
exports.getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: subscription
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new subscription
exports.createSubscription = async (req, res) => {
    try {
        const subscription = new Subscription(req.body);
        await subscription.save();
        res.status(201).json({
            status: 'success',
            data: subscription
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a subscription
exports.updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!subscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: subscription
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
